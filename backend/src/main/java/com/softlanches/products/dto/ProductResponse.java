package com.softlanches.products.dto;

public record ProductResponse(
        Long id,
        String nome,
        double preco,
        double custo,
        boolean ativo,
        Long receitaId,
        double margem
) {}
