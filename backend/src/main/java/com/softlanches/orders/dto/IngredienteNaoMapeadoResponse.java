package com.softlanches.orders.dto;

public record IngredienteNaoMapeadoResponse(
        Long ingredienteId,
        String ingredienteNome,
        String produtoNome,
        Long receitaId
) {}
