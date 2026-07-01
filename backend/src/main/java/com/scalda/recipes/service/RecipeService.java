package com.scalda.recipes.service;

import com.scalda.recipes.dto.CreateRecipeRequest;
import com.scalda.recipes.dto.IngredientResponse;
import com.scalda.recipes.dto.RecipeDetailResponse;
import com.scalda.recipes.dto.RecipeResponse;
import com.scalda.shared.dto.PageResponse;
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
