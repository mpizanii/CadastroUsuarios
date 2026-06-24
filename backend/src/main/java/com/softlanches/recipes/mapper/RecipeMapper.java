package com.softlanches.recipes.mapper;

import com.softlanches.recipes.dto.IngredientResponse;
import com.softlanches.recipes.dto.RecipeResponse;
import com.softlanches.recipes.model.Recipe;
import com.softlanches.recipes.model.RecipeIngredient;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface RecipeMapper {

    @Mapping(target = "modoPreparo", source = "modoPreparo")
    RecipeResponse toResponse(Recipe recipe);

    List<RecipeResponse> toResponseList(List<Recipe> recipes);

    IngredientResponse toIngredientResponse(RecipeIngredient ingredient);

    List<IngredientResponse> toIngredientResponseList(List<RecipeIngredient> ingredients);
}
