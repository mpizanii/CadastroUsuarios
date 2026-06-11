package com.softlanches.recipes.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;

public record MapIngredientRequest(

        @NotNull(message = "insumoId é obrigatório")
        @Positive(message = "insumoId deve ser positivo")
        Long insumoId,

        @PositiveOrZero(message = "Fator de conversão não pode ser negativo")
        Double fatorConversao
) {}
