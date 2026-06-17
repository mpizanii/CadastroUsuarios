package com.softlanches.recipes.controller;

import com.softlanches.recipes.dto.CreateRecipeRequest;
import com.softlanches.recipes.dto.IngredientResponse;
import com.softlanches.recipes.dto.RecipeDetailResponse;
import com.softlanches.recipes.dto.RecipeResponse;
import com.softlanches.recipes.service.RecipeService;
import com.softlanches.shared.dto.PageResponse;
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
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/receitas")
@RequiredArgsConstructor
@Tag(name = "Receitas", description = "Gerenciamento de receitas, ingredientes e otimização N+1 com JOIN FETCH")
@SecurityRequirement(name = "bearerAuth")
public class RecipeController {

    private final RecipeService service;

    @GetMapping
    @Operation(
        summary = "Listar receitas (paginado)",
        description = "Retorna as receitas do tenant (campos básicos: `id`, `nome`, `modoPreparo`, `createdAt`). Use `?page=0&size=20&sort=nome,asc`. Para detalhes com ingredientes, use `GET /api/receitas/{id}`."
    )
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Página de receitas retornada com sucesso"),
        @ApiResponse(responseCode = "401", description = "Token JWT ausente ou inválido",
            content = @Content),
        @ApiResponse(responseCode = "403", description = "Usuário sem empresa associada",
            content = @Content(mediaType = "application/json",
                schema = @Schema(implementation = GlobalExceptionHandler.ErrorResponse.class))),
        @ApiResponse(responseCode = "500", description = "Erro interno do servidor",
            content = @Content(mediaType = "application/json",
                schema = @Schema(implementation = GlobalExceptionHandler.ErrorResponse.class)))
    })
    public ResponseEntity<PageResponse<RecipeResponse>> findAll(
            @ParameterObject @PageableDefault(size = 20, sort = "nome") Pageable pageable) {
        return ResponseEntity.ok(service.findAll(pageable));
    }

    @GetMapping("/{id}")
    @Operation(
        summary = "Buscar receita com detalhes de ingredientes",
        description = """
            Retorna a receita com lista completa de ingredientes e seus mapeamentos para insumos de estoque.

            **Otimização N+1:** a query usa `JOIN FETCH` para carregar ingredientes + mapeamentos em uma única query,
            e busca nomes de insumos em batch com `IN clause` (total de 2 queries, independente do número de ingredientes).

            Cada ingrediente indica se está `mapeado` e, se sim, qual `insumoId`/`insumoNome` e `fatorConversao` se aplicam.
            """
    )
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Receita com ingredientes e mapeamentos",
            content = @Content(mediaType = "application/json",
                schema = @Schema(implementation = RecipeDetailResponse.class),
                examples = @ExampleObject(value = """
                    {
                      "id": 3,
                      "nome": "X-Burguer",
                      "modoPreparo": "Grelhe o hambúrguer por 4 min cada lado...",
                      "createdAt": "2025-01-10T09:00:00Z",
                      "ingredientes": [
                        {
                          "id": 11,
                          "nome": "Pão brioche",
                          "quantidade": 1,
                          "unidade": "unidade",
                          "mapeado": true,
                          "insumoId": 5,
                          "insumoNome": "Pão de hambúrguer brioche",
                          "fatorConversao": 1.0
                        },
                        {
                          "id": 12,
                          "nome": "Hambúrguer 150g",
                          "quantidade": 150,
                          "unidade": "g",
                          "mapeado": false,
                          "insumoId": null,
                          "insumoNome": null,
                          "fatorConversao": null
                        }
                      ]
                    }
                    """))),
        @ApiResponse(responseCode = "401", description = "Token JWT ausente ou inválido",
            content = @Content),
        @ApiResponse(responseCode = "403", description = "Usuário sem empresa associada",
            content = @Content(mediaType = "application/json",
                schema = @Schema(implementation = GlobalExceptionHandler.ErrorResponse.class))),
        @ApiResponse(responseCode = "404", description = "Receita não encontrada",
            content = @Content(mediaType = "application/json",
                schema = @Schema(implementation = GlobalExceptionHandler.ErrorResponse.class))),
        @ApiResponse(responseCode = "500", description = "Erro interno do servidor",
            content = @Content(mediaType = "application/json",
                schema = @Schema(implementation = GlobalExceptionHandler.ErrorResponse.class)))
    })
    public ResponseEntity<RecipeDetailResponse> findById(
            @Parameter(description = "ID da receita", example = "3", required = true)
            @PathVariable Long id) {
        return ResponseEntity.ok(service.findById(id));
    }

    @GetMapping("/{id}/ingredientes")
    @Operation(
        summary = "Listar ingredientes de uma receita",
        description = """
            Retorna a lista de ingredientes sem dados de mapeamento. Use quando precisar apenas dos ingredientes
            sem as informações de insumo vinculado (`IngredientResponse` é mais leve que `RecipeDetailResponse`).
            """
    )
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Ingredientes da receita",
            content = @Content(mediaType = "application/json",
                array = @ArraySchema(schema = @Schema(implementation = IngredientResponse.class)),
                examples = @ExampleObject(value = """
                    [
                      { "id": 11, "nome": "Pão brioche", "quantidade": 1, "unidade": "unidade" },
                      { "id": 12, "nome": "Hambúrguer 150g", "quantidade": 150, "unidade": "g" }
                    ]
                    """))),
        @ApiResponse(responseCode = "401", description = "Token JWT ausente ou inválido",
            content = @Content),
        @ApiResponse(responseCode = "403", description = "Usuário sem empresa associada",
            content = @Content(mediaType = "application/json",
                schema = @Schema(implementation = GlobalExceptionHandler.ErrorResponse.class))),
        @ApiResponse(responseCode = "404", description = "Receita não encontrada",
            content = @Content(mediaType = "application/json",
                schema = @Schema(implementation = GlobalExceptionHandler.ErrorResponse.class))),
        @ApiResponse(responseCode = "500", description = "Erro interno do servidor",
            content = @Content(mediaType = "application/json",
                schema = @Schema(implementation = GlobalExceptionHandler.ErrorResponse.class)))
    })
    public ResponseEntity<List<IngredientResponse>> findIngredients(
            @Parameter(description = "ID da receita", example = "3", required = true)
            @PathVariable Long id) {
        return ResponseEntity.ok(service.findIngredientsByRecipeId(id));
    }

    @PostMapping
    @PreAuthorize("@tenantSecurity.isAdmin()")
    @Operation(
        summary = "Criar receita com ingredientes",
        description = """
            Cria uma receita e seus ingredientes em uma única transação (`CascadeType.ALL`).
            Os ingredientes ficam **não mapeados** após a criação. Use `PUT /api/receitas/ingredientes/{id}/mapeamento`
            para vincular cada ingrediente a um insumo do estoque.

            O campo `ingredientes` é opcional — é possível criar uma receita sem ingredientes inicialmente.
            """
    )
    @ApiResponses({
        @ApiResponse(responseCode = "201", description = "Receita criada. Header `Location` aponta para o recurso.",
            content = @Content(mediaType = "application/json",
                schema = @Schema(implementation = RecipeDetailResponse.class))),
        @ApiResponse(responseCode = "400", description = "Dados inválidos (nome em branco, quantidade negativa etc.)",
            content = @Content(mediaType = "application/json",
                schema = @Schema(implementation = GlobalExceptionHandler.ValidationErrorResponse.class),
                examples = @ExampleObject(value = """
                    {
                      "status": 400,
                      "message": "Dados inválidos",
                      "errors": {
                        "nome": "Nome da receita é obrigatório",
                        "ingredientes[0].nome": "Nome do ingrediente é obrigatório"
                      },
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
    public ResponseEntity<RecipeDetailResponse> create(
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                description = "Receita com lista opcional de ingredientes",
                required = true,
                content = @Content(mediaType = "application/json",
                    schema = @Schema(implementation = CreateRecipeRequest.class),
                    examples = @ExampleObject(value = """
                        {
                          "nome": "X-Burguer",
                          "modoPreparo": "Grelhe o hambúrguer por 4 min cada lado. Monte com pão, queijo e salada.",
                          "ingredientes": [
                            { "nome": "Pão brioche", "quantidade": 1, "unidade": "unidade" },
                            { "nome": "Hambúrguer 150g", "quantidade": 150, "unidade": "g" },
                            { "nome": "Queijo cheddar", "quantidade": 30, "unidade": "g" }
                          ]
                        }
                        """)))
            @Valid @RequestBody CreateRecipeRequest request) {
        RecipeDetailResponse response = service.create(request);
        URI location = URI.create("/api/receitas/" + response.id());
        return ResponseEntity.created(location).body(response);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("@tenantSecurity.isAdmin()")
    @Operation(
        summary = "Remover receita",
        description = """
            Remove a receita e todos os seus ingredientes e mapeamentos em cascade (`CascadeType.ALL + orphanRemoval`).

            **Atenção:** se algum produto referencia esta receita via `receitaId`, o campo `receitaId` desse produto
            ficará apontando para um ID inexistente (sem FK constraint no nível JPA). Recomenda-se
            desvincular o produto antes (`PUT /api/produtos/{id}` com `receitaId: null`),
            ou usar `DELETE /api/produtos/{id}` que remove produto e receita em conjunto.
            """
    )
    @ApiResponses({
        @ApiResponse(responseCode = "204", description = "Receita e todos os ingredientes removidos com sucesso",
            content = @Content),
        @ApiResponse(responseCode = "401", description = "Token JWT ausente ou inválido",
            content = @Content),
        @ApiResponse(responseCode = "403", description = "Usuário sem empresa associada",
            content = @Content(mediaType = "application/json",
                schema = @Schema(implementation = GlobalExceptionHandler.ErrorResponse.class))),
        @ApiResponse(responseCode = "404", description = "Receita não encontrada",
            content = @Content(mediaType = "application/json",
                schema = @Schema(implementation = GlobalExceptionHandler.ErrorResponse.class))),
        @ApiResponse(responseCode = "500", description = "Erro interno do servidor",
            content = @Content(mediaType = "application/json",
                schema = @Schema(implementation = GlobalExceptionHandler.ErrorResponse.class)))
    })
    public ResponseEntity<Void> delete(
            @Parameter(description = "ID da receita", example = "3", required = true)
            @PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
