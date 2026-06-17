package com.softlanches.recipes.service;

import com.softlanches.recipes.dto.CreateRecipeRequest;
import com.softlanches.recipes.dto.IngredientResponse;
import com.softlanches.recipes.dto.RecipeDetailResponse;
import com.softlanches.recipes.dto.RecipeResponse;
import com.softlanches.shared.dto.PageResponse;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface RecipeService {

    List<RecipeResponse> findAll();

    PageResponse<RecipeResponse> findAll(Pageable pageable);

    RecipeDetailResponse findById(Long id);

    List<IngredientResponse> findIngredientsByRecipeId(Long recipeId);

    RecipeDetailResponse create(CreateRecipeRequest request);

    void delete(Long id);
}
