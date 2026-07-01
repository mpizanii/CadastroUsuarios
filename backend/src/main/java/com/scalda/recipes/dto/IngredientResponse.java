package com.scalda.recipes.dto;

import java.math.BigDecimal;

public record IngredientResponse(
        Long id,
        String nome,
        BigDecimal quantidade,
        String unidade
) {}
