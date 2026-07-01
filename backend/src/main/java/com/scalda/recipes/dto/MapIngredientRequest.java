package com.scalda.recipes.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;

import java.math.BigDecimal;

public record MapIngredientRequest(

        @NotNull(message = "insumoId é obrigatório")
        @Positive(message = "insumoId deve ser positivo")
        Long insumoId,

        @PositiveOrZero(message = "Fator de conversão não pode ser negativo")
        BigDecimal fatorConversao
) {}
