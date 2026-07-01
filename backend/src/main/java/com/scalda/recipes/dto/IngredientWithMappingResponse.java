package com.scalda.recipes.dto;

import java.math.BigDecimal;

public record IngredientWithMappingResponse(
        Long id,
        String nome,
        BigDecimal quantidade,
        String unidade,
        boolean mapeado,
        Long insumoId,
        String insumoNome,
        BigDecimal fatorConversao
) {}
