package com.scalda.customers.controller;

import com.scalda.customers.dto.CreateCustomerRequest;
import com.scalda.customers.dto.CustomerResponse;
import com.scalda.customers.dto.UpdateCustomerRequest;
import com.scalda.customers.service.CustomerService;
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
@RequestMapping("/api/clientes")
@RequiredArgsConstructor
@Tag(name = "Clientes", description = "Gerenciamento de clientes do tenant autenticado")
@SecurityRequirement(name = "bearerAuth")
public class CustomerController {

    private final CustomerService service;

    @GetMapping
    @Operation(
        summary = "Listar clientes (paginado)",
        description = """
            Retorna os clientes do tenant com suporte a paginação.
            Use `?page=0&size=20&sort=nome,asc` para controlar a paginação.
            Sem parâmetros, retorna a primeira página com 20 registros ordenados por `nome`.
            """
    )
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Página de clientes retornada com sucesso"),
        @ApiResponse(responseCode = "401", description = "Token JWT ausente ou inválido",
            content = @Content),
        @ApiResponse(responseCode = "403", description = "Usuário autenticado sem empresa associada",
            content = @Content(mediaType = "application/json",
                schema = @Schema(implementation = GlobalExceptionHandler.ErrorResponse.class))),
        @ApiResponse(responseCode = "500", description = "Erro interno do servidor",
            content = @Content(mediaType = "application/json",
                schema = @Schema(implementation = GlobalExceptionHandler.ErrorResponse.class)))
    })
    public ResponseEntity<PageResponse<CustomerResponse>> findAll(
            @ParameterObject @PageableDefault(size = 20, sort = "nome") Pageable pageable) {
        return ResponseEntity.ok(service.findAll(pageable));
    }

    @GetMapping("/{id}")
    @Operation(
        summary = "Buscar cliente por ID",
        description = "Retorna um cliente pelo seu ID. Verifica isolamento de tenant — não é possível acessar clientes de outra empresa."
    )
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Cliente encontrado",
            content = @Content(mediaType = "application/json",
                schema = @Schema(implementation = CustomerResponse.class))),
        @ApiResponse(responseCode = "401", description = "Token JWT ausente ou inválido",
            content = @Content),
        @ApiResponse(responseCode = "403", description = "Usuário autenticado sem empresa associada",
            content = @Content(mediaType = "application/json",
                schema = @Schema(implementation = GlobalExceptionHandler.ErrorResponse.class))),
        @ApiResponse(responseCode = "404", description = "Cliente não encontrado ou pertence a outro tenant",
            content = @Content(mediaType = "application/json",
                schema = @Schema(implementation = GlobalExceptionHandler.ErrorResponse.class))),
        @ApiResponse(responseCode = "500", description = "Erro interno do servidor",
            content = @Content(mediaType = "application/json",
                schema = @Schema(implementation = GlobalExceptionHandler.ErrorResponse.class)))
    })
    public ResponseEntity<CustomerResponse> findById(
            @Parameter(description = "ID do cliente", example = "1", required = true)
            @PathVariable Long id) {
        return ResponseEntity.ok(service.findById(id));
    }

    @PostMapping
    @PreAuthorize("@tenantSecurity.isAdmin()")
    @Operation(
        summary = "Cadastrar cliente",
        description = "Cria um novo cliente vinculado ao tenant do usuário autenticado. O `empresa_id` é resolvido automaticamente pelo JWT."
    )
    @ApiResponses({
        @ApiResponse(responseCode = "201", description = "Cliente criado com sucesso. O header `Location` aponta para o recurso criado.",
            content = @Content(mediaType = "application/json",
                schema = @Schema(implementation = CustomerResponse.class),
                examples = @ExampleObject(value = """
                    {
                      "id": 42,
                      "nome": "João da Silva",
                      "email": "joao@email.com",
                      "telefone": "(11) 99999-0001",
                      "endereco": "Rua das Flores, 123 — São Paulo/SP"
                    }
                    """))),
        @ApiResponse(responseCode = "400", description = "Dados inválidos (nome em branco, e-mail malformado etc.)",
            content = @Content(mediaType = "application/json",
                schema = @Schema(implementation = GlobalExceptionHandler.ValidationErrorResponse.class),
                examples = @ExampleObject(value = """
                    {
                      "status": 400,
                      "message": "Dados inválidos",
                      "errors": { "nome": "Nome é obrigatório" },
                      "timestamp": "2025-01-15T14:30:00Z"
                    }
                    """))),
        @ApiResponse(responseCode = "401", description = "Token JWT ausente ou inválido",
            content = @Content),
        @ApiResponse(responseCode = "403", description = "Usuário autenticado sem empresa associada",
            content = @Content(mediaType = "application/json",
                schema = @Schema(implementation = GlobalExceptionHandler.ErrorResponse.class))),
        @ApiResponse(responseCode = "500", description = "Erro interno do servidor",
            content = @Content(mediaType = "application/json",
                schema = @Schema(implementation = GlobalExceptionHandler.ErrorResponse.class)))
    })
    public ResponseEntity<CustomerResponse> create(
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                description = "Dados do cliente a ser criado. Apenas `nome` é obrigatório.",
                required = true,
                content = @Content(mediaType = "application/json",
                    schema = @Schema(implementation = CreateCustomerRequest.class),
                    examples = @ExampleObject(value = """
                        {
                          "nome": "João da Silva",
                          "email": "joao@email.com",
                          "telefone": "(11) 99999-0001",
                          "endereco": "Rua das Flores, 123 — São Paulo/SP"
                        }
                        """)))
            @Valid @RequestBody CreateCustomerRequest request) {
        CustomerResponse response = service.create(request);
        URI location = URI.create("/api/clientes/" + response.id());
        return ResponseEntity.created(location).body(response);
    }

    @PatchMapping("/{id}")
    @PreAuthorize("@tenantSecurity.isAdmin()")
    @Operation(
        summary = "Atualizar cliente parcialmente",
        description = "Atualiza apenas os campos informados no body (PATCH semântico). Campos `null` são ignorados."
    )
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Cliente atualizado com sucesso",
            content = @Content(mediaType = "application/json",
                schema = @Schema(implementation = CustomerResponse.class))),
        @ApiResponse(responseCode = "400", description = "Dados inválidos",
            content = @Content(mediaType = "application/json",
                schema = @Schema(implementation = GlobalExceptionHandler.ValidationErrorResponse.class))),
        @ApiResponse(responseCode = "401", description = "Token JWT ausente ou inválido",
            content = @Content),
        @ApiResponse(responseCode = "403", description = "Usuário autenticado sem empresa associada",
            content = @Content(mediaType = "application/json",
                schema = @Schema(implementation = GlobalExceptionHandler.ErrorResponse.class))),
        @ApiResponse(responseCode = "404", description = "Cliente não encontrado",
            content = @Content(mediaType = "application/json",
                schema = @Schema(implementation = GlobalExceptionHandler.ErrorResponse.class))),
        @ApiResponse(responseCode = "500", description = "Erro interno do servidor",
            content = @Content(mediaType = "application/json",
                schema = @Schema(implementation = GlobalExceptionHandler.ErrorResponse.class)))
    })
    public ResponseEntity<CustomerResponse> update(
            @Parameter(description = "ID do cliente", example = "1", required = true)
            @PathVariable Long id,
            @Valid @RequestBody UpdateCustomerRequest request) {
        return ResponseEntity.ok(service.update(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("@tenantSecurity.isAdmin()")
    @Operation(
        summary = "Remover cliente",
        description = "Remove permanentemente um cliente do tenant. Pedidos existentes que referenciam este cliente mantêm o `cliente_id`, mas `clienteNome` passa a ser `null` nas respostas."
    )
    @ApiResponses({
        @ApiResponse(responseCode = "204", description = "Cliente removido com sucesso",
            content = @Content),
        @ApiResponse(responseCode = "401", description = "Token JWT ausente ou inválido",
            content = @Content),
        @ApiResponse(responseCode = "403", description = "Usuário autenticado sem empresa associada",
            content = @Content(mediaType = "application/json",
                schema = @Schema(implementation = GlobalExceptionHandler.ErrorResponse.class))),
        @ApiResponse(responseCode = "404", description = "Cliente não encontrado",
            content = @Content(mediaType = "application/json",
                schema = @Schema(implementation = GlobalExceptionHandler.ErrorResponse.class))),
        @ApiResponse(responseCode = "500", description = "Erro interno do servidor",
            content = @Content(mediaType = "application/json",
                schema = @Schema(implementation = GlobalExceptionHandler.ErrorResponse.class)))
    })
    public ResponseEntity<Void> delete(
            @Parameter(description = "ID do cliente", example = "1", required = true)
            @PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
