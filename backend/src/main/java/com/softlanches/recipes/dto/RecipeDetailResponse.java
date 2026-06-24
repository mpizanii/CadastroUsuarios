package com.softlanches.recipes.dto;

import java.time.OffsetDateTime;
import java.util.List;

public record RecipeDetailResponse(
        Long id,
        String nome,
        String modoPreparo,
        OffsetDateTime createdAt,
        List<IngredientWithMappingResponse> ingredientes
) {}
