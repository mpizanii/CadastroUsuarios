package com.softlanches.recipes.dto;

import java.math.BigDecimal;

public record IngredientResponse(
        Long id,
        String nome,
        BigDecimal quantidade,
        String unidade
) {}
