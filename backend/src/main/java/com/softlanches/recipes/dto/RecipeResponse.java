package com.softlanches.recipes.dto;

import java.time.OffsetDateTime;

public record RecipeResponse(
        Long id,
        String nome,
        String modoPreparo,
        OffsetDateTime createdAt
) {}
