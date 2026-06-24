package com.softlanches.customers.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;

public record UpdateCustomerRequest(
        @Size(min = 1, max = 255, message = "Nome deve ter entre 1 e 255 caracteres")
        String nome,

        @Email(message = "Email inválido")
        @Size(max = 255, message = "Email deve ter no máximo 255 caracteres")
        String email,

        @Size(max = 50, message = "Telefone deve ter no máximo 50 caracteres")
        String telefone,

        @Size(max = 500, message = "Endereço deve ter no máximo 500 caracteres")
        String endereco
) {}
