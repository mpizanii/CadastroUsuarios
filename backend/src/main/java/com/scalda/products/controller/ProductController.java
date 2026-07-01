package com.scalda.products.controller;

import com.scalda.products.dto.CreateProductRequest;
import com.scalda.products.dto.ProductResponse;
import com.scalda.products.dto.UpdateProductRequest;
import com.scalda.products.service.ProductService;
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
@RequestMapping("/api/produtos")
@RequiredArgsConstructor
@Tag(name = "Produtos", description = "Gerenciamento de produtos com preço, custo e receita vinculada")
@SecurityRequirement(name = "bearerAuth")
public class ProductController {

    private final ProductService service;

    @GetMapping
    @Operation(
        summary = "Listar produtos (paginado)",
        description = "Retorna os produtos do tenant com suporte a paginação. O campo `margem` é calculado como `((preco - custo) / preco) * 100`. Use `?page=0&size=20&sort=nome,asc`."
    )
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Página de produtos retornada com sucesso"),
        @ApiResponse(responseCode = "401", description = "Token JWT ausente ou inválido",
            content = @Content),
        @ApiResponse(responseCode = "403", description = "Usuário sem empresa associada",
            content = @Content(mediaType = "application/json",
                schema = @Schema(implementation = GlobalExceptionHandler.ErrorResponse.class))),
        @ApiResponse(responseCode = "500", description = "Erro interno do servidor",
            content = @Content(mediaType = "application/json",
                schema = @Schema(implementation = GlobalExceptionHandler.ErrorResponse.class)))
    })
    public ResponseEntity<PageResponse<ProductResponse>> findAll(
            @ParameterObject @PageableDefault(size = 20, sort = "nome") Pageable pageable) {
        return ResponseEntity.ok(service.findAll(pageable));
    }

    @GetMapping("/{id}")
    @Operation(
        summary = "Buscar produto por ID",
        description = "Retorna um produto pelo ID, incluindo a margem calculada e o `receitaId` se houver receita vinculada."
    )
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Produto encontrado",
            content = @Content(mediaType = "application/json",
                schema = @Schema(implementation = ProductResponse.class),
                examples = @ExampleObject(value = """
                    {
                      "id": 10,
                      "nome": "X-Burguer",
                      "preco": 25.90,
                      "custo": 9.50,
                      "ativo": true,
                      "receitaId": 3,
                      "margem": 63.32
                    }
                    """))),
        @ApiResponse(responseCode = "401", description = "Token JWT ausente ou inválido",
            content = @Content),
        @ApiResponse(responseCode = "403", description = "Usuário sem empresa associada",
            content = @Content(mediaType = "application/json",
                schema = @Schema(implementation = GlobalExceptionHandler.ErrorResponse.class))),
        @ApiResponse(responseCode = "404", description = "Produto não encontrado",
            content = @Content(mediaType = "application/json",
                schema = @Schema(implementation = GlobalExceptionHandler.ErrorResponse.class))),
        @ApiResponse(responseCode = "500", description = "Erro interno do servidor",
            content = @Content(mediaType = "application/json",
                schema = @Schema(implementation = GlobalExceptionHandler.ErrorResponse.class)))
    })
    public ResponseEntity<ProductResponse> findById(
            @Parameter(description = "ID do produto", example = "10", required = true)
            @PathVariable Long id) {
        return ResponseEntity.ok(service.findById(id));
    }

    @GetMapping("/receita/{receitaId}")
    @Operation(
        summary = "Buscar produto por ID de receita",
        description = "Retorna o produto que possui a receita com o ID informado. Útil para navegação reversa receita → produto."
    )
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Produto vinculado à receita encontrado",
            content = @Content(mediaType = "application/json",
                schema = @Schema(implementation = ProductResponse.class))),
        @ApiResponse(responseCode = "401", description = "Token JWT ausente ou inválido",
            content = @Content),
        @ApiResponse(responseCode = "403", description = "Usuário sem empresa associada",
            content = @Content(mediaType = "application/json",
                schema = @Schema(implementation = GlobalExceptionHandler.ErrorResponse.class))),
        @ApiResponse(responseCode = "404", description = "Nenhum produto vinculado à receita informada",
            content = @Content(mediaType = "application/json",
                schema = @Schema(implementation = GlobalExceptionHandler.ErrorResponse.class))),
        @ApiResponse(responseCode = "500", description = "Erro interno do servidor",
            content = @Content(mediaType = "application/json",
                schema = @Schema(implementation = GlobalExceptionHandler.ErrorResponse.class)))
    })
    public ResponseEntity<ProductResponse> findByReceitaId(
            @Parameter(description = "ID da receita", example = "3", required = true)
            @PathVariable Long receitaId) {
        return ResponseEntity.ok(service.findByReceitaId(receitaId));
    }

    @PostMapping
    @PreAuthorize("@tenantSecurity.isAdmin()")
    @Operation(
        summary = "Cadastrar produto",
        description = """
            Cria um novo produto no tenant. Campos `preco`, `custo`, `ativo` e `receitaId` são opcionais.

            **Atenção:** ao deletar um produto que possui `receitaId`, a receita vinculada também é removida em cascade.
            """
    )
    @ApiResponses({
        @ApiResponse(responseCode = "201", description = "Produto criado. Header `Location` aponta para o recurso.",
            content = @Content(mediaType = "application/json",
                schema = @Schema(implementation = ProductResponse.class),
                examples = @ExampleObject(value = """
                    {
                      "id": 10,
                      "nome": "X-Burguer",
                      "preco": 25.90,
                      "custo": 9.50,
                      "ativo": true,
                      "receitaId": null,
                      "margem": 63.32
                    }
                    """))),
        @ApiResponse(responseCode = "400", description = "Dados inválidos (nome em branco, preço negativo etc.)",
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
    public ResponseEntity<ProductResponse> create(
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                description = "Dados do produto. Apenas `nome` é obrigatório.",
                required = true,
                content = @Content(mediaType = "application/json",
                    schema = @Schema(implementation = CreateProductRequest.class),
                    examples = @ExampleObject(value = """
                        {
                          "nome": "X-Burguer",
                          "preco": 25.90,
                          "custo": 9.50,
                          "ativo": true,
                          "receitaId": null
                        }
                        """)))
            @Valid @RequestBody CreateProductRequest request) {
        ProductResponse response = service.create(request);
        URI location = URI.create("/api/produtos/" + response.id());
        return ResponseEntity.created(location).body(response);
    }

    @PutMapping("/{id}")
    @PreAuthorize("@tenantSecurity.isAdmin()")
    @Operation(
        summary = "Substituir produto (PUT completo)",
        description = """
            Substituição completa do produto. **Todos os campos de dados são obrigatórios** (semântica PUT).

            Enviar `receitaId: null` desvincula a receita do produto **sem deletá-la**.
            Para deletar a receita, use `DELETE /api/receitas/{id}` separadamente.
            """
    )
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Produto atualizado com sucesso",
            content = @Content(mediaType = "application/json",
                schema = @Schema(implementation = ProductResponse.class))),
        @ApiResponse(responseCode = "400", description = "Dados inválidos ou campos obrigatórios ausentes",
            content = @Content(mediaType = "application/json",
                schema = @Schema(implementation = GlobalExceptionHandler.ValidationErrorResponse.class))),
        @ApiResponse(responseCode = "401", description = "Token JWT ausente ou inválido",
            content = @Content),
        @ApiResponse(responseCode = "403", description = "Usuário sem empresa associada",
            content = @Content(mediaType = "application/json",
                schema = @Schema(implementation = GlobalExceptionHandler.ErrorResponse.class))),
        @ApiResponse(responseCode = "404", description = "Produto não encontrado",
            content = @Content(mediaType = "application/json",
                schema = @Schema(implementation = GlobalExceptionHandler.ErrorResponse.class))),
        @ApiResponse(responseCode = "500", description = "Erro interno do servidor",
            content = @Content(mediaType = "application/json",
                schema = @Schema(implementation = GlobalExceptionHandler.ErrorResponse.class)))
    })
    public ResponseEntity<ProductResponse> update(
            @Parameter(description = "ID do produto", example = "10", required = true)
            @PathVariable Long id,
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                description = "Representação completa do produto. Todos os campos exceto `receitaId` são obrigatórios.",
                required = true,
                content = @Content(mediaType = "application/json",
                    schema = @Schema(implementation = UpdateProductRequest.class),
                    examples = @ExampleObject(value = """
                        {
                          "nome": "X-Burguer Especial",
                          "preco": 28.90,
                          "custo": 10.00,
                          "ativo": true,
                          "receitaId": 3
                        }
                        """)))
            @Valid @RequestBody UpdateProductRequest request) {
        return ResponseEntity.ok(service.update(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("@tenantSecurity.isAdmin()")
    @Operation(
        summary = "Remover produto",
        description = """
            Remove permanentemente o produto. **Se o produto tiver uma receita vinculada (`receitaId` não nulo),
            a receita e todos os seus ingredientes são removidos em cascade.**
            """
    )
    @ApiResponses({
        @ApiResponse(responseCode = "204", description = "Produto (e receita vinculada, se houver) removido com sucesso",
            content = @Content),
        @ApiResponse(responseCode = "401", description = "Token JWT ausente ou inválido",
            content = @Content),
        @ApiResponse(responseCode = "403", description = "Usuário sem empresa associada",
            content = @Content(mediaType = "application/json",
                schema = @Schema(implementation = GlobalExceptionHandler.ErrorResponse.class))),
        @ApiResponse(responseCode = "404", description = "Produto não encontrado",
            content = @Content(mediaType = "application/json",
                schema = @Schema(implementation = GlobalExceptionHandler.ErrorResponse.class))),
        @ApiResponse(responseCode = "500", description = "Erro interno do servidor",
            content = @Content(mediaType = "application/json",
                schema = @Schema(implementation = GlobalExceptionHandler.ErrorResponse.class)))
    })
    public ResponseEntity<Void> delete(
            @Parameter(description = "ID do produto", example = "10", required = true)
            @PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
