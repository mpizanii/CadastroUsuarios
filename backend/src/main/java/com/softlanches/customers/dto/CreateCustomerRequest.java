package com.softlanches.customers.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateCustomerRequest(
        @NotBlank(message = "Nome é obrigatório")
        @Size(max = 255, message = "Nome deve ter no máximo 255 caracteres")
        String nome,

        @Email(message = "Email inválido")
        @Size(max = 255, message = "Email deve ter no máximo 255 caracteres")
        String email,

        @Size(max = 50, message = "Telefone deve ter no máximo 50 caracteres")
        String telefone,

        @Size(max = 500, message = "Endereço deve ter no máximo 500 caracteres")
        String endereco
) {}
