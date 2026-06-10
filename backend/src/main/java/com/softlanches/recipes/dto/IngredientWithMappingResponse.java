package com.softlanches.recipes.dto;

public record IngredientWithMappingResponse(
        Long id,
        String nome,
        double quantidade,
        String unidade,
        boolean mapeado,
        Long insumoId,
        String insumoNome,
        Double fatorConversao
) {}
