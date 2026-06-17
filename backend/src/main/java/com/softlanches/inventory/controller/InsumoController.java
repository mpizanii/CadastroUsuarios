package com.softlanches.inventory.controller;

import com.softlanches.inventory.dto.CreateInsumoRequest;
import com.softlanches.inventory.dto.InsumoResponse;
import com.softlanches.inventory.dto.UpdateInsumoRequest;
import com.softlanches.inventory.service.InsumoService;
import com.softlanches.shared.exception.GlobalExceptionHandler;
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
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/insumos")
@RequiredArgsConstructor
@Tag(name = "Insumos (Estoque)", description = "Controle de insumos do estoque com cálculo automático de status")
@SecurityRequirement(name = "bearerAuth")
public class InsumoController {

    private final InsumoService service;

    @GetMapping
    @Operation(
        summary = "Listar todos os insumos",
        description = """
            Retorna todos os insumos do tenant com `statusEstoque` calculado automaticamente pelo mapper:

            | Condição | statusEstoque |
            |---|---|
            | `quantidade < estoqueMinimo` | `CRITICO_ESTOQUE_MINIMO` |
            | `validade <= hoje` | `CRITICO_VALIDADE` |
            | `quantidade <= estoqueMinimo × 1.2` | `BAIXO_ESTOQUE_MINIMO` |
            | `validade <= hoje + 7 dias` | `BAIXO_VALIDADE` |
            | Normal | `OK` |
            """
    )
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Lista de insumos com status de estoque",
            content = @Content(mediaType = "application/json",
                array = @ArraySchema(schema = @Schema(implementation = InsumoResponse.class)))),
        @ApiResponse(responseCode = "401", description = "Token JWT ausente ou inválido",
            content = @Content),
        @ApiResponse(responseCode = "403", description = "Usuário sem empresa associada",
            content = @Content(mediaType = "application/json",
                schema = @Schema(implementation = GlobalExceptionHandler.ErrorResponse.class))),
        @ApiResponse(responseCode = "500", description = "Erro interno do servidor",
            content = @Content(mediaType = "application/json",
                schema = @Schema(implementation = GlobalExceptionHandler.ErrorResponse.class)))
    })
    public ResponseEntity<List<InsumoResponse>> findAll() {
        return ResponseEntity.ok(service.findAll());
    }

    @GetMapping("/alertas")
    @Operation(
        summary = "Listar insumos com alertas",
        description = """
            Retorna apenas os insumos cujo `statusEstoque` **não é `OK`** — ou seja, insumos em estado crítico ou baixo.
            Usado para o painel de alertas/notificações do dashboard.

            **Nota de performance:** o filtro é aplicado em memória após carregar todos os insumos do tenant.
            Para tenants com muitos insumos, considere adicionar um filtro a nível de banco de dados.
            """
    )
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Insumos em estado de alerta (lista pode estar vazia se tudo estiver OK)",
            content = @Content(mediaType = "application/json",
                array = @ArraySchema(schema = @Schema(implementation = InsumoResponse.class)),
                examples = @ExampleObject(value = """
                    [
                      {
                        "id": 2,
                        "nome": "Carne bovina",
                        "quantidade": 0.5,
                        "unidade": "kg",
                        "validade": "2025-01-20",
                        "estoqueMinimo": 5.0,
                        "createdAt": "2025-01-01T08:00:00Z",
                        "statusEstoque": "CRITICO_ESTOQUE_MINIMO"
                      }
                    ]
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
    public ResponseEntity<List<InsumoResponse>> findAlertas() {
        return ResponseEntity.ok(service.findAlertas());
    }

    @GetMapping("/{id}")
    @Operation(
        summary = "Buscar insumo por ID",
        description = "Retorna um insumo pelo ID com `statusEstoque` calculado."
    )
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Insumo encontrado",
            content = @Content(mediaType = "application/json",
                schema = @Schema(implementation = InsumoResponse.class),
                examples = @ExampleObject(value = """
                    {
                      "id": 5,
                      "nome": "Pão de hambúrguer brioche",
                      "quantidade": 120,
                      "unidade": "unidade",
                      "validade": "2025-02-01",
                      "estoqueMinimo": 20,
                      "createdAt": "2025-01-05T10:00:00Z",
                      "statusEstoque": "OK"
                    }
                    """))),
        @ApiResponse(responseCode = "401", description = "Token JWT ausente ou inválido",
            content = @Content),
        @ApiResponse(responseCode = "403", description = "Usuário sem empresa associada",
            content = @Content(mediaType = "application/json",
                schema = @Schema(implementation = GlobalExceptionHandler.ErrorResponse.class))),
        @ApiResponse(responseCode = "404", description = "Insumo não encontrado",
            content = @Content(mediaType = "application/json",
                schema = @Schema(implementation = GlobalExceptionHandler.ErrorResponse.class))),
        @ApiResponse(responseCode = "500", description = "Erro interno do servidor",
            content = @Content(mediaType = "application/json",
                schema = @Schema(implementation = GlobalExceptionHandler.ErrorResponse.class)))
    })
    public ResponseEntity<InsumoResponse> findById(
            @Parameter(description = "ID do insumo", example = "5", required = true)
            @PathVariable Long id) {
        return ResponseEntity.ok(service.findById(id));
    }

    @PostMapping
    @Operation(
        summary = "Cadastrar insumo",
        description = "Cria um novo insumo no estoque do tenant. `validade` e `estoqueMinimo` são opcionais."
    )
    @ApiResponses({
        @ApiResponse(responseCode = "201", description = "Insumo criado. Header `Location` aponta para o recurso.",
            content = @Content(mediaType = "application/json",
                schema = @Schema(implementation = InsumoResponse.class))),
        @ApiResponse(responseCode = "400", description = "Dados inválidos (nome em branco, quantidade negativa etc.)",
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
    public ResponseEntity<InsumoResponse> create(
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                description = "Dados do insumo. `nome`, `quantidade` e `unidade` são obrigatórios.",
                required = true,
                content = @Content(mediaType = "application/json",
                    schema = @Schema(implementation = CreateInsumoRequest.class),
                    examples = @ExampleObject(value = """
                        {
                          "nome": "Carne bovina",
                          "quantidade": 50.0,
                          "unidade": "kg",
                          "validade": "2025-03-01",
                          "estoqueMinimo": 5.0
                        }
                        """)))
            @Valid @RequestBody CreateInsumoRequest request) {
        InsumoResponse response = service.create(request);
        URI location = URI.create("/api/insumos/" + response.id());
        return ResponseEntity.created(location).body(response);
    }

    @PatchMapping("/{id}")
    @Operation(
        summary = "Atualizar insumo parcialmente",
        description = """
            Atualiza apenas os campos informados (PATCH semântico, campos `null` são ignorados).

            **Campo especial `removeMapping`:** quando `true`, remove **todos os mapeamentos de ingredientes**
            vinculados a este insumo (`ingredientes_insumo` onde `insumo_id = id`).
            Use com cuidado — ingredientes ficam não mapeados e bloqueiam baixa de estoque.
            """
    )
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Insumo atualizado com sucesso",
            content = @Content(mediaType = "application/json",
                schema = @Schema(implementation = InsumoResponse.class))),
        @ApiResponse(responseCode = "400", description = "Dados inválidos",
            content = @Content(mediaType = "application/json",
                schema = @Schema(implementation = GlobalExceptionHandler.ValidationErrorResponse.class))),
        @ApiResponse(responseCode = "401", description = "Token JWT ausente ou inválido",
            content = @Content),
        @ApiResponse(responseCode = "403", description = "Usuário sem empresa associada",
            content = @Content(mediaType = "application/json",
                schema = @Schema(implementation = GlobalExceptionHandler.ErrorResponse.class))),
        @ApiResponse(responseCode = "404", description = "Insumo não encontrado",
            content = @Content(mediaType = "application/json",
                schema = @Schema(implementation = GlobalExceptionHandler.ErrorResponse.class))),
        @ApiResponse(responseCode = "500", description = "Erro interno do servidor",
            content = @Content(mediaType = "application/json",
                schema = @Schema(implementation = GlobalExceptionHandler.ErrorResponse.class)))
    })
    public ResponseEntity<InsumoResponse> update(
            @Parameter(description = "ID do insumo", example = "5", required = true)
            @PathVariable Long id,
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                description = "Campos a atualizar. Campos omitidos/null são ignorados. `removeMapping: true` desvincula todos os ingredientes mapeados a este insumo.",
                required = true,
                content = @Content(mediaType = "application/json",
                    schema = @Schema(implementation = UpdateInsumoRequest.class),
                    examples = @ExampleObject(value = """
                        {
                          "quantidade": 45.0,
                          "estoqueMinimo": 8.0,
                          "removeMapping": false
                        }
                        """)))
            @Valid @RequestBody UpdateInsumoRequest request) {
        return ResponseEntity.ok(service.update(id, request));
    }

    @DeleteMapping("/{id}")
    @Operation(
        summary = "Remover insumo",
        description = """
            Remove permanentemente o insumo do estoque.

            **Atenção:** mapeamentos que referenciam este insumo (`ingredientes_insumo`) podem causar constraint violation
            dependendo da configuração do banco. Remova os mapeamentos previamente usando `removeMapping: true`
            no `PATCH /api/insumos/{id}` ou delete individualmente via `DELETE /api/receitas/ingredientes/{id}/mapeamento`.
            """
    )
    @ApiResponses({
        @ApiResponse(responseCode = "204", description = "Insumo removido com sucesso",
            content = @Content),
        @ApiResponse(responseCode = "401", description = "Token JWT ausente ou inválido",
            content = @Content),
        @ApiResponse(responseCode = "403", description = "Usuário sem empresa associada",
            content = @Content(mediaType = "application/json",
                schema = @Schema(implementation = GlobalExceptionHandler.ErrorResponse.class))),
        @ApiResponse(responseCode = "404", description = "Insumo não encontrado",
            content = @Content(mediaType = "application/json",
                schema = @Schema(implementation = GlobalExceptionHandler.ErrorResponse.class))),
        @ApiResponse(responseCode = "500", description = "Erro interno do servidor — possível violação de FK com mapeamentos existentes",
            content = @Content(mediaType = "application/json",
                schema = @Schema(implementation = GlobalExceptionHandler.ErrorResponse.class)))
    })
    public ResponseEntity<Void> delete(
            @Parameter(description = "ID do insumo", example = "5", required = true)
            @PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
