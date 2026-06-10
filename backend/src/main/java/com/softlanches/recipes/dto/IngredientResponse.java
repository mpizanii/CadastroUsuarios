package com.softlanches.recipes.dto;

public record IngredientResponse(
        Long id,
        String nome,
        double quantidade,
        String unidade
) {}
