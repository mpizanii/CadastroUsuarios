package com.softlanches.recipes.controller;

import com.softlanches.recipes.dto.MapIngredientRequest;
import com.softlanches.recipes.dto.MappingResponse;
import com.softlanches.recipes.service.MappingService;
import com.softlanches.shared.exception.GlobalExceptionHandler;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
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
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/receitas/ingredientes")
@RequiredArgsConstructor
@Tag(name = "Mapeamentos", description = "Vinculação de ingredientes da receita a insumos do estoque para habilitar baixa automática")
@SecurityRequirement(name = "bearerAuth")
public class MappingController {

    private final MappingService mappingService;

    @PutMapping("/{ingredienteId}/mapeamento")
    @PreAuthorize("@tenantSecurity.isAdmin()")
    @Operation(
        summary = "Criar ou atualizar mapeamento (upsert)",
        description = """
            Vincula um ingrediente de receita a um insumo do estoque. Se já existir um mapeamento para o ingrediente,
            ele é **substituído** (upsert). Se não existir, é criado.

            **fatorConversao:** define a proporção entre a unidade do ingrediente na receita e a unidade do insumo no estoque.
            Exemplo: receita usa 150g de "Carne moída" → insumo "Carne bovina" medido em kg → `fatorConversao = 0.001`
            (150 × 0.001 = 0.15 kg descontados do estoque por unidade de pedido).

            Ingredientes não mapeados bloqueiam a baixa de estoque para o produto correspondente.
            """
    )
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Mapeamento criado ou atualizado com sucesso",
            content = @Content(mediaType = "application/json",
                schema = @Schema(implementation = MappingResponse.class),
                examples = @ExampleObject(value = """
                    {
                      "id": 7,
                      "ingredienteId": 12,
                      "insumoId": 4,
                      "fatorConversao": 0.001
                    }
                    """))),
        @ApiResponse(responseCode = "400", description = "Dados inválidos (`insumoId` nulo ou negativo, `fatorConversao` negativo)",
            content = @Content(mediaType = "application/json",
                schema = @Schema(implementation = GlobalExceptionHandler.ValidationErrorResponse.class),
                examples = @ExampleObject(value = """
                    {
                      "status": 400,
                      "message": "Dados inválidos",
                      "errors": { "insumoId": "insumoId é obrigatório" },
                      "timestamp": "2025-01-15T14:30:00Z"
                    }
                    """))),
        @ApiResponse(responseCode = "401", description = "Token JWT ausente ou inválido",
            content = @Content),
        @ApiResponse(responseCode = "403", description = "Usuário sem empresa associada",
            content = @Content(mediaType = "application/json",
                schema = @Schema(implementation = GlobalExceptionHandler.ErrorResponse.class))),
        @ApiResponse(responseCode = "404", description = "Ingrediente ou insumo não encontrado",
            content = @Content(mediaType = "application/json",
                schema = @Schema(implementation = GlobalExceptionHandler.ErrorResponse.class))),
        @ApiResponse(responseCode = "500", description = "Erro interno do servidor",
            content = @Content(mediaType = "application/json",
                schema = @Schema(implementation = GlobalExceptionHandler.ErrorResponse.class)))
    })
    public ResponseEntity<MappingResponse> upsert(
            @Parameter(description = "ID do ingrediente da receita (`receitaIngredientes.id`)", example = "12", required = true)
            @PathVariable Long ingredienteId,
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                description = "ID do insumo a vincular e o fator de conversão de unidade. `fatorConversao` assume `1.0` se omitido.",
                required = true,
                content = @Content(mediaType = "application/json",
                    schema = @Schema(implementation = MapIngredientRequest.class),
                    examples = @ExampleObject(value = """
                        {
                          "insumoId": 4,
                          "fatorConversao": 0.001
                        }
                        """)))
            @Valid @RequestBody MapIngredientRequest request) {
        return ResponseEntity.ok(mappingService.upsert(ingredienteId, request));
    }

    @DeleteMapping("/{ingredienteId}/mapeamento")
    @PreAuthorize("@tenantSecurity.isAdmin()")
    @Operation(
        summary = "Remover mapeamento de ingrediente",
        description = """
            Remove o vínculo entre o ingrediente e o insumo. Após a remoção, o ingrediente fica **não mapeado**
            e não participará da baixa de estoque em pedidos futuros.

            O ingrediente em si não é removido — apenas o mapeamento (`ingredientes_insumo`).
            """
    )
    @ApiResponses({
        @ApiResponse(responseCode = "204", description = "Mapeamento removido com sucesso",
            content = @Content),
        @ApiResponse(responseCode = "401", description = "Token JWT ausente ou inválido",
            content = @Content),
        @ApiResponse(responseCode = "403", description = "Usuário sem empresa associada",
            content = @Content(mediaType = "application/json",
                schema = @Schema(implementation = GlobalExceptionHandler.ErrorResponse.class))),
        @ApiResponse(responseCode = "404", description = "Ingrediente não encontrado ou sem mapeamento ativo",
            content = @Content(mediaType = "application/json",
                schema = @Schema(implementation = GlobalExceptionHandler.ErrorResponse.class))),
        @ApiResponse(responseCode = "500", description = "Erro interno do servidor",
            content = @Content(mediaType = "application/json",
                schema = @Schema(implementation = GlobalExceptionHandler.ErrorResponse.class)))
    })
    public ResponseEntity<Void> delete(
            @Parameter(description = "ID do ingrediente da receita (`receitaIngredientes.id`)", example = "12", required = true)
            @PathVariable Long ingredienteId) {
        mappingService.delete(ingredienteId);
        return ResponseEntity.noContent().build();
    }
}
