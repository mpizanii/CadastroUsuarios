package com.scalda.orders.controller;

import com.scalda.orders.dto.*;
import com.scalda.orders.service.OrderService;
import com.scalda.shared.dto.PageResponse;
import com.scalda.shared.exception.GlobalExceptionHandler;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/pedidos")
@RequiredArgsConstructor
@Tag(name = "Pedidos", description = "Registro de pedidos com baixa automática de estoque e verificações pré-pedido")
@SecurityRequirement(name = "bearerAuth")
public class OrderController {

    private final OrderService orderService;

    @GetMapping
    @Operation(
        summary = "Listar pedidos (paginado)",
        description = """
            Retorna os pedidos do tenant com itens embutidos, ordenados por data decrescente.
            Use `?page=0&size=20`. O `clienteNome` é resolvido em tempo de execução.

            **Status possíveis:** `Pendente` | `Em Preparo` | `Em Rota de Entrega` | `Entregue`
            """
    )
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Página de pedidos retornada com sucesso"),
        @ApiResponse(responseCode = "401", description = "Token JWT ausente ou inválido",
            content = @Content),
        @ApiResponse(responseCode = "403", description = "Usuário sem empresa associada",
            content = @Content(mediaType = "application/json",
                schema = @Schema(implementation = GlobalExceptionHandler.ErrorResponse.class))),
        @ApiResponse(responseCode = "500", description = "Erro interno do servidor",
            content = @Content(mediaType = "application/json",
                schema = @Schema(implementation = GlobalExceptionHandler.ErrorResponse.class)))
    })
    public ResponseEntity<PageResponse<OrderResponse>> findAll(
            @ParameterObject @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(orderService.findAll(pageable));
    }

    @GetMapping("/{id}")
    @Operation(
        summary = "Buscar pedido por ID",
        description = "Retorna um pedido com seus itens. Realiza JOIN FETCH para carregar os itens em uma única query."
    )
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Pedido encontrado",
            content = @Content(mediaType = "application/json",
                schema = @Schema(implementation = OrderResponse.class),
                examples = @ExampleObject(value = """
                    {
                      "id": 101,
                      "clienteId": 42,
                      "clienteNome": "João da Silva",
                      "dataPedido": "2025-01-15T20:30:00Z",
                      "valorTotal": 51.80,
                      "status": "Pendente",
                      "observacoes": "Sem cebola",
                      "produtos": [
                        {
                          "id": 201,
                          "produtoId": 10,
                          "produtoNome": "X-Burguer",
                          "quantidade": 2,
                          "precoUnitario": 25.90
                        }
                      ]
                    }
                    """))),
        @ApiResponse(responseCode = "401", description = "Token JWT ausente ou inválido",
            content = @Content),
        @ApiResponse(responseCode = "403", description = "Usuário sem empresa associada",
            content = @Content(mediaType = "application/json",
                schema = @Schema(implementation = GlobalExceptionHandler.ErrorResponse.class))),
        @ApiResponse(responseCode = "404", description = "Pedido não encontrado",
            content = @Content(mediaType = "application/json",
                schema = @Schema(implementation = GlobalExceptionHandler.ErrorResponse.class))),
        @ApiResponse(responseCode = "500", description = "Erro interno do servidor",
            content = @Content(mediaType = "application/json",
                schema = @Schema(implementation = GlobalExceptionHandler.ErrorResponse.class)))
    })
    public ResponseEntity<OrderResponse> findById(
            @Parameter(description = "ID do pedido", example = "101", required = true)
            @PathVariable Long id) {
        return ResponseEntity.ok(orderService.findById(id));
    }

    @PostMapping
    @PreAuthorize("@tenantSecurity.isAdmin()")
    @Operation(
        summary = "Criar pedido",
        description = """
            Cria um novo pedido com status `Pendente`. O `valorTotal` é calculado automaticamente
            com base no preço atual de cada produto no banco (ignora `precoUnitario` do request se o produto existir).

            **`darBaixaEstoque: true`:** executa a baixa de estoque imediatamente após criar o pedido.
            Recomenda-se chamar `POST /api/pedidos/verificar-mapeamento` e `POST /api/pedidos/verificar-estoque`
            antes para identificar possíveis problemas.

            **`clienteId`:** opcional — pedido pode ser feito sem cliente identificado.
            """
    )
    @ApiResponses({
        @ApiResponse(responseCode = "201", description = "Pedido criado. Header `Location` aponta para o recurso.",
            content = @Content(mediaType = "application/json",
                schema = @Schema(implementation = OrderResponse.class))),
        @ApiResponse(responseCode = "400", description = "Lista de produtos vazia ou dados inválidos",
            content = @Content(mediaType = "application/json",
                schema = @Schema(implementation = GlobalExceptionHandler.ValidationErrorResponse.class),
                examples = @ExampleObject(value = """
                    {
                      "status": 400,
                      "message": "Dados inválidos",
                      "errors": { "produtos": "must not be empty" },
                      "timestamp": "2025-01-15T14:30:00Z"
                    }
                    """))),
        @ApiResponse(responseCode = "401", description = "Token JWT ausente ou inválido",
            content = @Content),
        @ApiResponse(responseCode = "403", description = "Usuário sem empresa associada",
            content = @Content(mediaType = "application/json",
                schema = @Schema(implementation = GlobalExceptionHandler.ErrorResponse.class))),
        @ApiResponse(responseCode = "500", description = "Erro interno do servidor",
            content = @Content(mediaType = "application/json",
                schema = @Schema(implementation = GlobalExceptionHandler.ErrorResponse.class)))
    })
    public ResponseEntity<OrderResponse> create(
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                description = "Dados do pedido. `produtos` não pode estar vazio. `clienteId` e `observacoes` são opcionais.",
                required = true,
                content = @Content(mediaType = "application/json",
                    schema = @Schema(implementation = CreateOrderRequest.class),
                    examples = @ExampleObject(value = """
                        {
                          "clienteId": 42,
                          "observacoes": "Sem cebola",
                          "produtos": [
                            { "produtoId": 10, "quantidade": 2, "precoUnitario": 25.90 }
                          ],
                          "darBaixaEstoque": true
                        }
                        """)))
            @Valid @RequestBody CreateOrderRequest request) {
        OrderResponse created = orderService.create(request);
        return ResponseEntity.created(URI.create("/api/pedidos/" + created.id())).body(created);
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("@tenantSecurity.isAdmin()")
    @Operation(
        summary = "Atualizar status do pedido",
        description = """
            Atualiza apenas o status do pedido. Valores válidos (enum `OrderStatus`):

            | Valor | Significado |
            |---|---|
            | `Pendente` | Pedido recebido, aguardando preparo |
            | `Em Preparo` | Em produção na cozinha |
            | `Em Rota de Entrega` | Saiu para entrega |
            | `Entregue` | Confirmado pelo cliente |
            | `Cancelado` | Pedido cancelado |

            Enviar um valor fora desta lista retorna **400 Bad Request**.
            Somente usuários com role diferente de `visualizador` podem alterar status.
            """
    )
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Status atualizado com sucesso",
            content = @Content(mediaType = "application/json",
                schema = @Schema(implementation = OrderResponse.class))),
        @ApiResponse(responseCode = "400", description = "Campo `status` em branco",
            content = @Content(mediaType = "application/json",
                schema = @Schema(implementation = GlobalExceptionHandler.ValidationErrorResponse.class))),
        @ApiResponse(responseCode = "401", description = "Token JWT ausente ou inválido",
            content = @Content),
        @ApiResponse(responseCode = "403", description = "Usuário sem empresa associada",
            content = @Content(mediaType = "application/json",
                schema = @Schema(implementation = GlobalExceptionHandler.ErrorResponse.class))),
        @ApiResponse(responseCode = "404", description = "Pedido não encontrado",
            content = @Content(mediaType = "application/json",
                schema = @Schema(implementation = GlobalExceptionHandler.ErrorResponse.class))),
        @ApiResponse(responseCode = "500", description = "Erro interno do servidor",
            content = @Content(mediaType = "application/json",
                schema = @Schema(implementation = GlobalExceptionHandler.ErrorResponse.class)))
    })
    public ResponseEntity<OrderResponse> updateStatus(
            @Parameter(description = "ID do pedido", example = "101", required = true)
            @PathVariable Long id,
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                description = "Novo status do pedido",
                required = true,
                content = @Content(mediaType = "application/json",
                    schema = @Schema(implementation = UpdateOrderStatusRequest.class),
                    examples = @ExampleObject(value = """
                        { "status": "Em Preparo" }
                        """)))
            @Valid @RequestBody UpdateOrderStatusRequest request) {
        return ResponseEntity.ok(orderService.updateStatus(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("@tenantSecurity.isAdmin()")
    @Operation(
        summary = "Remover pedido",
        description = "Remove permanentemente o pedido e todos os seus itens (`pedidoprodutos`) em cascade. Não desfaz baixas de estoque já realizadas."
    )
    @ApiResponses({
        @ApiResponse(responseCode = "204", description = "Pedido removido com sucesso",
            content = @Content),
        @ApiResponse(responseCode = "401", description = "Token JWT ausente ou inválido",
            content = @Content),
        @ApiResponse(responseCode = "403", description = "Usuário sem empresa associada",
            content = @Content(mediaType = "application/json",
                schema = @Schema(implementation = GlobalExceptionHandler.ErrorResponse.class))),
        @ApiResponse(responseCode = "404", description = "Pedido não encontrado",
            content = @Content(mediaType = "application/json",
                schema = @Schema(implementation = GlobalExceptionHandler.ErrorResponse.class))),
        @ApiResponse(responseCode = "500", description = "Erro interno do servidor",
            content = @Content(mediaType = "application/json",
                schema = @Schema(implementation = GlobalExceptionHandler.ErrorResponse.class)))
    })
    public ResponseEntity<Void> delete(
            @Parameter(description = "ID do pedido", example = "101", required = true)
            @PathVariable Long id) {
        orderService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/verificar-mapeamento")
    @Operation(
        summary = "Verificar mapeamentos antes do pedido",
        description = """
            Verifica se todos os ingredientes das receitas dos produtos selecionados estão mapeados para insumos.
            Retorna a lista de ingredientes não mapeados que impedirão a baixa de estoque.

            **Recomendado chamar antes de `POST /api/pedidos`** quando `darBaixaEstoque = true`.
            Ingredientes não mapeados não bloqueiam a criação do pedido, mas bloqueiam a baixa de estoque.

            **Performance:** executa 2 queries no banco (1 batch produtos + 1 JOIN FETCH ingredientes+mapeamentos via `IN` clause).
            """
    )
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Resultado da verificação de mapeamentos",
            content = @Content(mediaType = "application/json",
                schema = @Schema(implementation = VerificarMapeamentoResponse.class),
                examples = @ExampleObject(value = """
                    {
                      "todosMapeados": false,
                      "ingredientesNaoMapeados": [
                        {
                          "ingredienteId": 12,
                          "ingredienteNome": "Hambúrguer 150g",
                          "produtoNome": "X-Burguer",
                          "receitaId": 3
                        }
                      ]
                    }
                    """))),
        @ApiResponse(responseCode = "400", description = "Lista de produtos vazia ou dados inválidos",
            content = @Content(mediaType = "application/json",
                schema = @Schema(implementation = GlobalExceptionHandler.ValidationErrorResponse.class))),
        @ApiResponse(responseCode = "401", description = "Token JWT ausente ou inválido",
            content = @Content),
        @ApiResponse(responseCode = "403", description = "Usuário sem empresa associada",
            content = @Content(mediaType = "application/json",
                schema = @Schema(implementation = GlobalExceptionHandler.ErrorResponse.class))),
        @ApiResponse(responseCode = "500", description = "Erro interno do servidor",
            content = @Content(mediaType = "application/json",
                schema = @Schema(implementation = GlobalExceptionHandler.ErrorResponse.class)))
    })
    public ResponseEntity<VerificarMapeamentoResponse> verificarMapeamento(
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                description = "Lista de itens do pedido a verificar (mesmo formato de `CreateOrderRequest.produtos`)",
                required = true,
                content = @Content(mediaType = "application/json",
                    array = @ArraySchema(schema = @Schema(implementation = OrderItemRequest.class)),
                    examples = @ExampleObject(value = """
                        [
                          { "produtoId": 10, "quantidade": 2, "precoUnitario": 25.90 }
                        ]
                        """)))
            @Valid @RequestBody List<OrderItemRequest> produtos) {
        return ResponseEntity.ok(orderService.verificarMapeamento(produtos));
    }

    @PostMapping("/verificar-estoque")
    @Operation(
        summary = "Verificar disponibilidade de estoque antes do pedido",
        description = """
            Verifica se há estoque suficiente para todos os insumos necessários para os produtos do pedido.
            Retorna avisos por nível de criticidade:

            | tipo | Condição |
            |---|---|
            | `CRITICO` | Estoque insuficiente (saldo negativo após o pedido) |
            | `ALERTA` | Restará menos de 10% ou menos de 10 unidades após o pedido |
            | `INFO` | Restará menos de 30% após o pedido |

            **Recomendado chamar antes de `POST /api/pedidos`** com `darBaixaEstoque = true`.

            **Performance:** executa 3 queries no banco (batch produtos + JOIN FETCH ingredientes/mapeamentos + batch insumos).
            """
    )
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Resultado da verificação de estoque",
            content = @Content(mediaType = "application/json",
                schema = @Schema(implementation = VerificarEstoqueResponse.class),
                examples = @ExampleObject(value = """
                    {
                      "temAvisos": true,
                      "avisos": [
                        {
                          "tipo": "CRITICO",
                          "mensagem": "Estoque insuficiente para o insumo Carne bovina necessário para o produto X-Burguer.",
                          "insumoNome": "Carne bovina",
                          "quantidadeAtual": 0.05,
                          "quantidadeNecessaria": 0.30,
                          "quantidadeFaltante": 0.25,
                          "produtoNome": "X-Burguer"
                        }
                      ]
                    }
                    """))),
        @ApiResponse(responseCode = "400", description = "Lista de produtos vazia ou dados inválidos",
            content = @Content(mediaType = "application/json",
                schema = @Schema(implementation = GlobalExceptionHandler.ValidationErrorResponse.class))),
        @ApiResponse(responseCode = "401", description = "Token JWT ausente ou inválido",
            content = @Content),
        @ApiResponse(responseCode = "403", description = "Usuário sem empresa associada",
            content = @Content(mediaType = "application/json",
                schema = @Schema(implementation = GlobalExceptionHandler.ErrorResponse.class))),
        @ApiResponse(responseCode = "500", description = "Erro interno do servidor",
            content = @Content(mediaType = "application/json",
                schema = @Schema(implementation = GlobalExceptionHandler.ErrorResponse.class)))
    })
    public ResponseEntity<VerificarEstoqueResponse> verificarEstoque(
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                description = "Lista de itens do pedido a verificar",
                required = true,
                content = @Content(mediaType = "application/json",
                    array = @ArraySchema(schema = @Schema(implementation = OrderItemRequest.class)),
                    examples = @ExampleObject(value = """
                        [
                          { "produtoId": 10, "quantidade": 2, "precoUnitario": 25.90 }
                        ]
                        """)))
            @Valid @RequestBody List<OrderItemRequest> produtos) {
        return ResponseEntity.ok(orderService.verificarEstoque(produtos));
    }

    @PostMapping("/{id}/baixa-estoque")
    @PreAuthorize("@tenantSecurity.isAdmin()")
    @Operation(
        summary = "Executar baixa de estoque de um pedido existente",
        description = """
            Executa manualmente a baixa de estoque para um pedido já criado.
            Use quando o pedido foi criado com `darBaixaEstoque: false` e deseja-se realizar a baixa posteriormente.

            A baixa calcula: `quantidade_ingrediente × fator_conversao × quantidade_pedido` para cada insumo mapeado.
            O saldo do insumo nunca vai abaixo de zero (clamped ao mínimo de 0).

            **Idempotente:** após a primeira execução bem-sucedida, novas chamadas retornam **400 Bad Request**
            com a mensagem `Baixa de estoque já foi executada para este pedido`.
            """
    )
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Baixa de estoque realizada com sucesso",
            content = @Content),
        @ApiResponse(responseCode = "401", description = "Token JWT ausente ou inválido",
            content = @Content),
        @ApiResponse(responseCode = "403", description = "Usuário sem empresa associada",
            content = @Content(mediaType = "application/json",
                schema = @Schema(implementation = GlobalExceptionHandler.ErrorResponse.class))),
        @ApiResponse(responseCode = "404", description = "Pedido não encontrado",
            content = @Content(mediaType = "application/json",
                schema = @Schema(implementation = GlobalExceptionHandler.ErrorResponse.class))),
        @ApiResponse(responseCode = "500", description = "Erro interno do servidor",
            content = @Content(mediaType = "application/json",
                schema = @Schema(implementation = GlobalExceptionHandler.ErrorResponse.class)))
    })
    public ResponseEntity<Void> darBaixaEstoque(
            @Parameter(description = "ID do pedido", example = "101", required = true)
            @PathVariable Long id) {
        orderService.darBaixaEstoque(id);
        return ResponseEntity.ok().build();
    }
}
