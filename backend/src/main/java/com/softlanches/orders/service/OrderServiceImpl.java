package com.softlanches.orders.service;

import com.softlanches.customers.repository.CustomerRepository;
import com.softlanches.inventory.model.Insumo;
import com.softlanches.inventory.repository.InsumoRepository;
import com.softlanches.orders.dto.*;
import com.softlanches.orders.model.Order;
import com.softlanches.orders.model.OrderItem;
import com.softlanches.orders.repository.OrderRepository;
import com.softlanches.products.model.Product;
import com.softlanches.products.repository.ProductRepository;
import com.softlanches.recipes.model.IngredientMapping;
import com.softlanches.recipes.model.RecipeIngredient;
import com.softlanches.recipes.repository.IngredientMappingRepository;
import com.softlanches.recipes.repository.RecipeIngredientRepository;
import com.softlanches.shared.exception.ResourceNotFoundException;
import com.softlanches.shared.tenant.TenantContext;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final CustomerRepository customerRepository;
    private final RecipeIngredientRepository recipeIngredientRepository;
    private final IngredientMappingRepository ingredientMappingRepository;
    private final InsumoRepository insumoRepository;

    @Override
    @Transactional(readOnly = true)
    public List<OrderResponse> findAll() {
        UUID empresaId = TenantContext.getRequiredEmpresaId();
        List<Order> orders = orderRepository.findAllByEmpresaIdWithItems(empresaId);
        return orders.stream().map(o -> toResponse(o, empresaId)).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public OrderResponse findById(Long id) {
        UUID empresaId = TenantContext.getRequiredEmpresaId();
        Order order = orderRepository.findByIdAndEmpresaIdWithItems(id, empresaId)
                .orElseThrow(() -> new ResourceNotFoundException("Pedido", id));
        return toResponse(order, empresaId);
    }

    @Override
    public OrderResponse create(CreateOrderRequest request) {
        UUID empresaId = TenantContext.getRequiredEmpresaId();

        List<Long> produtoIds = request.produtos().stream()
                .map(OrderItemRequest::produtoId)
                .toList();
        Map<Long, Product> produtosMap = productRepository.findAllByIdInAndEmpresaId(produtoIds, empresaId).stream()
                .collect(Collectors.toMap(Product::getId, p -> p));

        BigDecimal valorTotal = request.produtos().stream()
                .map(item -> {
                    Product produto = produtosMap.get(item.produtoId());
                    BigDecimal preco = produto != null ? produto.getPreco() : BigDecimal.valueOf(item.precoUnitario());
                    return preco.multiply(BigDecimal.valueOf(item.quantidade()));
                })
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Order order = new Order();
        order.setEmpresaId(empresaId);
        order.setClienteId(request.clienteId());
        order.setData(OffsetDateTime.now());
        order.setValor(valorTotal);
        order.setStatus("Pendente");
        order.setObservacoes(request.observacoes());

        for (OrderItemRequest itemReq : request.produtos()) {
            OrderItem item = new OrderItem();
            item.setOrder(order);
            item.setProdutoId(itemReq.produtoId());
            item.setQuantidade(itemReq.quantidade());
            item.setEmpresaId(empresaId);
            order.getItems().add(item);
        }

        Order saved = orderRepository.save(order);

        if (request.darBaixaEstoque()) {
            darBaixaEstoqueInterno(saved, produtosMap, empresaId);
        }

        return toResponse(saved, produtosMap, resolveClienteNome(saved.getClienteId(), empresaId));
    }

    @Override
    public OrderResponse updateStatus(Long id, UpdateOrderStatusRequest request) {
        UUID empresaId = TenantContext.getRequiredEmpresaId();
        Order order = orderRepository.findByIdAndEmpresaIdWithItems(id, empresaId)
                .orElseThrow(() -> new ResourceNotFoundException("Pedido", id));
        order.setStatus(request.status());
        return toResponse(orderRepository.save(order), empresaId);
    }

    @Override
    public void delete(Long id) {
        UUID empresaId = TenantContext.getRequiredEmpresaId();
        Order order = orderRepository.findByIdAndEmpresaIdWithItems(id, empresaId)
                .orElseThrow(() -> new ResourceNotFoundException("Pedido", id));
        orderRepository.delete(order);
    }

    @Override
    @Transactional(readOnly = true)
    public VerificarMapeamentoResponse verificarMapeamento(List<OrderItemRequest> produtos) {
        UUID empresaId = TenantContext.getRequiredEmpresaId();

        List<Long> produtoIds = produtos.stream().map(OrderItemRequest::produtoId).toList();
        Map<Long, Product> produtosMap = productRepository.findAllByIdInAndEmpresaId(produtoIds, empresaId).stream()
                .collect(Collectors.toMap(Product::getId, p -> p));

        List<IngredienteNaoMapeadoResponse> naoMapeados = new ArrayList<>();

        for (OrderItemRequest itemReq : produtos) {
            Product produto = produtosMap.get(itemReq.produtoId());
            if (produto == null || produto.getReceitaId() == null) continue;

            List<RecipeIngredient> ingredientes = recipeIngredientRepository
                    .findAllByRecipe_Id(produto.getReceitaId());

            for (RecipeIngredient ingrediente : ingredientes) {
                boolean mapeado = ingredientMappingRepository
                        .findByRecipeIngredient_Id(ingrediente.getId())
                        .isPresent();
                if (!mapeado) {
                    naoMapeados.add(new IngredienteNaoMapeadoResponse(
                            ingrediente.getId(),
                            ingrediente.getNome(),
                            produto.getNome(),
                            produto.getReceitaId()
                    ));
                }
            }
        }

        return new VerificarMapeamentoResponse(naoMapeados.isEmpty(), naoMapeados);
    }

    @Override
    @Transactional(readOnly = true)
    public VerificarEstoqueResponse verificarEstoque(List<OrderItemRequest> produtos) {
        UUID empresaId = TenantContext.getRequiredEmpresaId();

        List<Long> produtoIds = produtos.stream().map(OrderItemRequest::produtoId).toList();
        Map<Long, Product> produtosMap = productRepository.findAllByIdInAndEmpresaId(produtoIds, empresaId).stream()
                .collect(Collectors.toMap(Product::getId, p -> p));

        List<AvisoEstoqueResponse> avisos = new ArrayList<>();

        for (OrderItemRequest itemReq : produtos) {
            Product produto = produtosMap.get(itemReq.produtoId());
            if (produto == null || produto.getReceitaId() == null) continue;

            List<RecipeIngredient> ingredientes = recipeIngredientRepository
                    .findAllByRecipe_Id(produto.getReceitaId());

            for (RecipeIngredient ingrediente : ingredientes) {
                Optional<IngredientMapping> mappingOpt = ingredientMappingRepository
                        .findByRecipeIngredient_Id(ingrediente.getId());
                if (mappingOpt.isEmpty()) continue;

                IngredientMapping mapping = mappingOpt.get();
                Optional<Insumo> insumoOpt = insumoRepository
                        .findByIdAndEmpresaId(mapping.getInsumoId(), empresaId);
                if (insumoOpt.isEmpty()) continue;

                Insumo insumo = insumoOpt.get();
                BigDecimal quantidadeNecessaria = calcularQuantidade(
                        ingrediente.getQuantidade(), mapping.getFatorConversao(), itemReq.quantidade());
                BigDecimal quantidadeRestante = insumo.getQuantidade().subtract(quantidadeNecessaria);

                AvisoEstoqueResponse aviso = gerarAviso(insumo, produto.getNome(),
                        quantidadeNecessaria, quantidadeRestante);
                if (aviso != null) avisos.add(aviso);
            }
        }

        return new VerificarEstoqueResponse(!avisos.isEmpty(), avisos);
    }

    @Override
    public void darBaixaEstoque(Long pedidoId) {
        UUID empresaId = TenantContext.getRequiredEmpresaId();
        Order order = orderRepository.findByIdAndEmpresaIdWithItems(pedidoId, empresaId)
                .orElseThrow(() -> new ResourceNotFoundException("Pedido", pedidoId));

        List<Long> produtoIds = order.getItems().stream().map(OrderItem::getProdutoId).toList();
        Map<Long, Product> produtosMap = productRepository.findAllByIdInAndEmpresaId(produtoIds, empresaId).stream()
                .collect(Collectors.toMap(Product::getId, p -> p));

        darBaixaEstoqueInterno(order, produtosMap, empresaId);
    }

    // --- Helpers privados ---

    private void darBaixaEstoqueInterno(Order order, Map<Long, Product> produtosMap, UUID empresaId) {
        for (OrderItem item : order.getItems()) {
            Product produto = produtosMap.get(item.getProdutoId());
            if (produto == null || produto.getReceitaId() == null) continue;

            List<RecipeIngredient> ingredientes = recipeIngredientRepository
                    .findAllByRecipe_Id(produto.getReceitaId());

            for (RecipeIngredient ingrediente : ingredientes) {
                ingredientMappingRepository.findByRecipeIngredient_Id(ingrediente.getId())
                        .ifPresent(mapping -> insumoRepository
                                .findByIdAndEmpresaId(mapping.getInsumoId(), empresaId)
                                .ifPresent(insumo -> {
                                    BigDecimal quantidade = calcularQuantidade(
                                            ingrediente.getQuantidade(),
                                            mapping.getFatorConversao(),
                                            item.getQuantidade());
                                    BigDecimal nova = insumo.getQuantidade().subtract(quantidade)
                                            .max(BigDecimal.ZERO);
                                    insumo.setQuantidade(nova);
                                    insumoRepository.save(insumo);
                                }));
            }
        }
    }

    private BigDecimal calcularQuantidade(BigDecimal qtdIngrediente, BigDecimal fatorConversao, int qtdPedido) {
        BigDecimal fator = fatorConversao != null ? fatorConversao : BigDecimal.ONE;
        return qtdIngrediente
                .multiply(fator)
                .multiply(BigDecimal.valueOf(qtdPedido));
    }

    private AvisoEstoqueResponse gerarAviso(Insumo insumo, String produtoNome,
                                             BigDecimal quantidadeNecessaria, BigDecimal quantidadeRestante) {
        if (quantidadeRestante.compareTo(BigDecimal.ZERO) < 0) {
            return new AvisoEstoqueResponse("CRITICO",
                    "Estoque insuficiente para o insumo " + insumo.getNome() +
                            " necessário para o produto " + produtoNome + ".",
                    insumo.getNome(), insumo.getQuantidade(), quantidadeNecessaria,
                    quantidadeNecessaria.subtract(insumo.getQuantidade()), produtoNome);
        }
        if (insumo.getQuantidade().compareTo(BigDecimal.ZERO) == 0) return null;

        double percentualRestante = quantidadeRestante.doubleValue() / insumo.getQuantidade().doubleValue();
        if (percentualRestante < 0.1 || quantidadeRestante.compareTo(BigDecimal.TEN) < 0) {
            return new AvisoEstoqueResponse("ALERTA",
                    "Estoque de " + insumo.getNome() + " ficará crítico após este pedido",
                    insumo.getNome(), insumo.getQuantidade(), quantidadeNecessaria, BigDecimal.ZERO, produtoNome);
        }
        if (percentualRestante < 0.3) {
            return new AvisoEstoqueResponse("INFO",
                    "Estoque de " + insumo.getNome() + " ficará baixo após este pedido",
                    insumo.getNome(), insumo.getQuantidade(), quantidadeNecessaria, BigDecimal.ZERO, produtoNome);
        }
        return null;
    }

    private String resolveClienteNome(Long clienteId, UUID empresaId) {
        if (clienteId == null) return null;
        return customerRepository.findByIdAndEmpresaId(clienteId, empresaId)
                .map(c -> c.getNome())
                .orElse(null);
    }

    private OrderResponse toResponse(Order order, UUID empresaId) {
        List<Long> produtoIds = order.getItems().stream().map(OrderItem::getProdutoId).toList();
        Map<Long, Product> produtosMap = productRepository.findAllByIdInAndEmpresaId(produtoIds, empresaId).stream()
                .collect(Collectors.toMap(Product::getId, p -> p));
        return toResponse(order, produtosMap, resolveClienteNome(order.getClienteId(), empresaId));
    }

    private OrderResponse toResponse(Order order, Map<Long, Product> produtosMap, String clienteNome) {
        List<OrderItemResponse> items = order.getItems().stream()
                .map(item -> {
                    Product produto = produtosMap.get(item.getProdutoId());
                    String nome = produto != null ? produto.getNome() : "Produto não encontrado";
                    BigDecimal preco = produto != null ? produto.getPreco() : BigDecimal.ZERO;
                    return new OrderItemResponse(item.getId(), item.getProdutoId(), nome, item.getQuantidade(), preco);
                })
                .toList();

        return new OrderResponse(
                order.getId(),
                order.getClienteId(),
                clienteNome,
                order.getData(),
                order.getValor(),
                order.getStatus(),
                order.getObservacoes(),
                items
        );
    }
}
