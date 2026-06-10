package com.softlanches.customers.dto;

public record CustomerResponse(
        Long id,
        String nome,
        String email,
        String telefone,
        String endereco
) {}
