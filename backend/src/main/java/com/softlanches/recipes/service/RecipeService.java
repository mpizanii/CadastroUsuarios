package com.softlanches.recipes.service;

import com.softlanches.recipes.dto.CreateRecipeRequest;
import com.softlanches.recipes.dto.IngredientResponse;
import com.softlanches.recipes.dto.RecipeDetailResponse;
import com.softlanches.recipes.dto.RecipeResponse;

import java.util.List;

public interface RecipeService {

    List<RecipeResponse> findAll();

    RecipeDetailResponse findById(Long id);

    List<IngredientResponse> findIngredientsByRecipeId(Long recipeId);

    RecipeDetailResponse create(CreateRecipeRequest request);

    void delete(Long id);
}
