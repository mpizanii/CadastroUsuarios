package com.softlanches.recipes.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.List;

public record CreateRecipeRequest(

        @NotBlank(message = "Nome da receita é obrigatório")
        @Size(max = 255)
        String nome,

        @Size(max = 5000)
        String modoPreparo,

        @Valid
        List<CreateIngredientRequest> ingredientes
) {}
