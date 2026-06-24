package com.softlanches.orders.service;

import com.softlanches.customers.model.Customer;
import com.softlanches.customers.repository.CustomerRepository;
import com.softlanches.inventory.model.Insumo;
import com.softlanches.inventory.repository.InsumoRepository;
import com.softlanches.orders.dto.*;
import com.softlanches.orders.model.Order;
import com.softlanches.orders.model.OrderItem;
import com.softlanches.orders.model.OrderStatus;
import com.softlanches.shared.exception.BusinessException;
import com.softlanches.orders.repository.OrderRepository;
import com.softlanches.products.model.Product;
import com.softlanches.products.repository.ProductRepository;
import com.softlanches.recipes.model.IngredientMapping;
import com.softlanches.recipes.model.RecipeIngredient;
import com.softlanches.recipes.repository.RecipeIngredientRepository;
import com.softlanches.shared.dto.PageResponse;
import com.softlanches.shared.exception.ResourceNotFoundException;
import com.softlanches.shared.tenant.TenantContext;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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
    private final InsumoRepository insumoRepository;

    @Override
    @Transactional(readOnly = true)
    public List<OrderResponse> findAll() {
        UUID empresaId = TenantContext.getRequiredEmpresaId();
        List<Order> orders = orderRepository.findAllByEmpresaIdWithItems(empresaId);

        // P4: 1 batch query para todos os produtos de todos os pedidos
        List<Long> allProdutoIds = orders.stream()
                .flatMap(o -> o.getItems().stream())
                .map(OrderItem::getProdutoId)
                .distinct()
                .toList();
        Map<Long, Product> produtosMap = allProdutoIds.isEmpty()
                ? Collections.emptyMap()
                : productRepository.findAllByIdInAndEmpresaId(allProdutoIds, empresaId).stream()
                        .collect(Collectors.toMap(Product::getId, p -> p));

        // P4: 1 batch query para todos os clientes referenciados nos pedidos
        List<Long> allClienteIds = orders.stream()
                .map(Order::getClienteId)
                .filter(Objects::nonNull)
                .distinct()
                .toList();
        Map<Long, String> clienteNomes = allClienteIds.isEmpty()
                ? Collections.emptyMap()
                : customerRepository.findAllByIdInAndEmpresaId(allClienteIds, empresaId).stream()
                        .collect(Collectors.toMap(Customer::getId, Customer::getNome));

        return orders.stream()
                .map(o -> toResponse(o, produtosMap, clienteNomes.get(o.getClienteId())))
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<OrderResponse> findAll(Pageable pageable) {
        UUID empresaId = TenantContext.getRequiredEmpresaId();

        // P7: pagina apenas IDs para evitar HHH-90003004 (JOIN FETCH + Pageable em memória)
        Page<Order> pageIds = orderRepository.findAllByEmpresaId(empresaId, pageable);
        List<Long> ids = pageIds.getContent().stream().map(Order::getId).toList();

        if (ids.isEmpty()) {
            return PageResponse.of(pageIds.map(o -> toResponse(o, Collections.emptyMap(), null)));
        }

        List<Order> ordersWithItems = orderRepository.findAllByIdInWithItems(ids);

        List<Long> allProdutoIds = ordersWithItems.stream()
                .flatMap(o -> o.getItems().stream())
                .map(OrderItem::getProdutoId)
                .distinct()
                .toList();
        Map<Long, Product> produtosMap = allProdutoIds.isEmpty()
                ? Collections.emptyMap()
                : productRepository.findAllByIdInAndEmpresaId(allProdutoIds, empresaId).stream()
                        .collect(Collectors.toMap(Product::getId, p -> p));

        List<Long> allClienteIds = ordersWithItems.stream()
                .map(Order::getClienteId)
                .filter(Objects::nonNull)
                .distinct()
                .toList();
        Map<Long, String> clienteNomes = allClienteIds.isEmpty()
                ? Collections.emptyMap()
                : customerRepository.findAllByIdInAndEmpresaId(allClienteIds, empresaId).stream()
                        .collect(Collectors.toMap(Customer::getId, Customer::getNome));

        Map<Long, Order> ordersById = ordersWithItems.stream()
                .collect(Collectors.toMap(Order::getId, o -> o));

        List<OrderResponse> content = ids.stream()
                .map(id -> {
                    Order o = ordersById.get(id);
                    return toResponse(o, produtosMap, clienteNomes.get(o.getClienteId()));
                })
                .toList();

        return new PageResponse<>(content, pageIds.getNumber(), pageIds.getSize(),
                pageIds.getTotalElements(), pageIds.getTotalPages());
    }

    @Override
    @Transactional(readOnly = true)
    public OrderResponse findById(Long id) {
        UUID empresaId = TenantContext.getRequiredEmpresaId();
        Order order = orderRepository.findByIdAndEmpresaIdWithItems(id, empresaId)
                .orElseThrow(() -> new ResourceNotFoundException("Pedido", id));

        List<Long> produtoIds = order.getItems().stream().map(OrderItem::getProdutoId).toList();
        Map<Long, Product> produtosMap = produtoIds.isEmpty()
                ? Collections.emptyMap()
                : productRepository.findAllByIdInAndEmpresaId(produtoIds, empresaId).stream()
                        .collect(Collectors.toMap(Product::getId, p -> p));

        String clienteNome = resolveClienteNome(order.getClienteId(), empresaId);
        return toResponse(order, produtosMap, clienteNome);
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
                    BigDecimal preco = produto != null ? produto.getPreco()
                            : (item.precoUnitario() != null ? item.precoUnitario() : BigDecimal.ZERO);
                    return preco.multiply(BigDecimal.valueOf(item.quantidade()));
                })
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Order order = new Order();
        order.setEmpresaId(empresaId);
        order.setClienteId(request.clienteId());
        order.setData(OffsetDateTime.now());
        order.setValor(valorTotal);
        order.setStatus(OrderStatus.PENDENTE);
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

        String clienteNome = resolveClienteNome(saved.getClienteId(), empresaId);
        return toResponse(saved, produtosMap, clienteNome);
    }

    @Override
    public OrderResponse updateStatus(Long id, UpdateOrderStatusRequest request) {
        UUID empresaId = TenantContext.getRequiredEmpresaId();
        Order order = orderRepository.findByIdAndEmpresaIdWithItems(id, empresaId)
                .orElseThrow(() -> new ResourceNotFoundException("Pedido", id));
        order.setStatus(request.status());
        Order saved = orderRepository.save(order);

        // P8: reusa os itens já carregados; faz 1 batch query para produtos
        List<Long> produtoIds = saved.getItems().stream().map(OrderItem::getProdutoId).toList();
        Map<Long, Product> produtosMap = produtoIds.isEmpty()
                ? Collections.emptyMap()
                : productRepository.findAllByIdInAndEmpresaId(produtoIds, empresaId).stream()
                        .collect(Collectors.toMap(Product::getId, p -> p));
        String clienteNome = resolveClienteNome(saved.getClienteId(), empresaId);
        return toResponse(saved, produtosMap, clienteNome);
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

        // P1: batch de produtos
        List<Long> produtoIds = produtos.stream().map(OrderItemRequest::produtoId).toList();
        Map<Long, Product> produtosMap = productRepository.findAllByIdInAndEmpresaId(produtoIds, empresaId).stream()
                .collect(Collectors.toMap(Product::getId, p -> p));

        // P1: batch de ingredientes com mapeamento (1 query com JOIN FETCH)
        List<Long> receitaIds = produtosMap.values().stream()
                .map(Product::getReceitaId)
                .filter(Objects::nonNull)
                .distinct()
                .toList();

        if (receitaIds.isEmpty()) {
            return new VerificarMapeamentoResponse(true, Collections.emptyList());
        }

        Map<Long, List<RecipeIngredient>> ingredientesPorReceita =
                recipeIngredientRepository.findAllByRecipe_IdInWithMapping(receitaIds).stream()
                        .collect(Collectors.groupingBy(i -> i.getRecipe().getId()));

        List<IngredienteNaoMapeadoResponse> naoMapeados = new ArrayList<>();
        for (OrderItemRequest itemReq : produtos) {
            Product produto = produtosMap.get(itemReq.produtoId());
            if (produto == null || produto.getReceitaId() == null) continue;

            List<RecipeIngredient> ingredientes =
                    ingredientesPorReceita.getOrDefault(produto.getReceitaId(), Collections.emptyList());
            for (RecipeIngredient ingrediente : ingredientes) {
                if (ingrediente.getMapping() == null) {
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

        // P2: batch de produtos e ingredientes
        List<Long> produtoIds = produtos.stream().map(OrderItemRequest::produtoId).toList();
        Map<Long, Product> produtosMap = productRepository.findAllByIdInAndEmpresaId(produtoIds, empresaId).stream()
                .collect(Collectors.toMap(Product::getId, p -> p));

        List<Long> receitaIds = produtosMap.values().stream()
                .map(Product::getReceitaId)
                .filter(Objects::nonNull)
                .distinct()
                .toList();

        if (receitaIds.isEmpty()) {
            return new VerificarEstoqueResponse(false, Collections.emptyList());
        }

        // P2: 1 query com JOIN FETCH para ingredientes + mapeamentos
        Map<Long, List<RecipeIngredient>> ingredientesPorReceita =
                recipeIngredientRepository.findAllByRecipe_IdInWithMapping(receitaIds).stream()
                        .collect(Collectors.groupingBy(i -> i.getRecipe().getId()));

        // P2: 1 batch query para todos os insumos necessários
        List<Long> insumoIds = ingredientesPorReceita.values().stream()
                .flatMap(List::stream)
                .map(RecipeIngredient::getMapping)
                .filter(Objects::nonNull)
                .map(IngredientMapping::getInsumoId)
                .distinct()
                .toList();
        Map<Long, Insumo> insumosMap = insumoIds.isEmpty()
                ? Collections.emptyMap()
                : insumoRepository.findAllByIdInAndEmpresaId(insumoIds, empresaId).stream()
                        .collect(Collectors.toMap(Insumo::getId, i -> i));

        // Constrói mapa de pedido (produtoId → quantidade)
        Map<Long, Integer> quantidadePorProduto = produtos.stream()
                .collect(Collectors.toMap(OrderItemRequest::produtoId, OrderItemRequest::quantidade));

        List<AvisoEstoqueResponse> avisos = new ArrayList<>();
        for (Product produto : produtosMap.values()) {
            if (produto.getReceitaId() == null) continue;
            int qtdPedido = quantidadePorProduto.getOrDefault(produto.getId(), 0);

            List<RecipeIngredient> ingredientes =
                    ingredientesPorReceita.getOrDefault(produto.getReceitaId(), Collections.emptyList());
            for (RecipeIngredient ingrediente : ingredientes) {
                if (ingrediente.getMapping() == null) continue;
                Insumo insumo = insumosMap.get(ingrediente.getMapping().getInsumoId());
                if (insumo == null) continue;

                BigDecimal quantidadeNecessaria = calcularQuantidade(
                        ingrediente.getQuantidade(), ingrediente.getMapping().getFatorConversao(), qtdPedido);
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

        if (order.isBaixaExecutada()) {
            throw new BusinessException("Baixa de estoque já foi executada para este pedido.");
        }

        List<Long> produtoIds = order.getItems().stream().map(OrderItem::getProdutoId).toList();
        Map<Long, Product> produtosMap = productRepository.findAllByIdInAndEmpresaId(produtoIds, empresaId).stream()
                .collect(Collectors.toMap(Product::getId, p -> p));

        darBaixaEstoqueInterno(order, produtosMap, empresaId);
    }

    // --- Helpers privados ---

    private void darBaixaEstoqueInterno(Order order, Map<Long, Product> produtosMap, UUID empresaId) {
        // P3: batch de ingredientes + mapeamentos (1 query com JOIN FETCH)
        List<Long> receitaIds = produtosMap.values().stream()
                .map(Product::getReceitaId)
                .filter(Objects::nonNull)
                .distinct()
                .toList();
        if (receitaIds.isEmpty()) return;

        Map<Long, List<RecipeIngredient>> ingredientesPorReceita =
                recipeIngredientRepository.findAllByRecipe_IdInWithMapping(receitaIds).stream()
                        .collect(Collectors.groupingBy(i -> i.getRecipe().getId()));

        // P3: acumula alterações por insumo antes de salvar (evita N saves)
        Map<Long, BigDecimal> descontoPorInsumo = new HashMap<>();
        for (OrderItem item : order.getItems()) {
            Product produto = produtosMap.get(item.getProdutoId());
            if (produto == null || produto.getReceitaId() == null) continue;

            List<RecipeIngredient> ingredientes =
                    ingredientesPorReceita.getOrDefault(produto.getReceitaId(), Collections.emptyList());
            for (RecipeIngredient ingrediente : ingredientes) {
                if (ingrediente.getMapping() == null) continue;
                Long insumoId = ingrediente.getMapping().getInsumoId();
                BigDecimal desconto = calcularQuantidade(
                        ingrediente.getQuantidade(),
                        ingrediente.getMapping().getFatorConversao(),
                        item.getQuantidade());
                descontoPorInsumo.merge(insumoId, desconto, BigDecimal::add);
            }
        }

        if (descontoPorInsumo.isEmpty()) return;

        // P3: 1 batch query para todos os insumos afetados + saveAll ao final
        List<Insumo> insumosAfetados = insumoRepository
                .findAllByIdInAndEmpresaId(new ArrayList<>(descontoPorInsumo.keySet()), empresaId);

        for (Insumo insumo : insumosAfetados) {
            BigDecimal desconto = descontoPorInsumo.get(insumo.getId());
            if (desconto != null) {
                BigDecimal nova = insumo.getQuantidade().subtract(desconto).max(BigDecimal.ZERO);
                insumo.setQuantidade(nova);
            }
        }
        insumoRepository.saveAll(insumosAfetados);

        order.setBaixaExecutada(true);
        orderRepository.save(order);
    }

    private BigDecimal calcularQuantidade(BigDecimal qtdIngrediente, BigDecimal fatorConversao, int qtdPedido) {
        BigDecimal fator = fatorConversao != null ? fatorConversao : BigDecimal.ONE;
        return qtdIngrediente.multiply(fator).multiply(BigDecimal.valueOf(qtdPedido));
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
                .map(Customer::getNome)
                .orElse(null);
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
