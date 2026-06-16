package com.softlanches.recipes.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public record CreateIngredientRequest(

        @NotBlank(message = "Nome do ingrediente é obrigatório")
        @Size(max = 255)
        String nome,

        @PositiveOrZero(message = "Quantidade não pode ser negativa")
        BigDecimal quantidade,

        @NotBlank(message = "Unidade é obrigatória")
        @Size(max = 50)
        String unidade
) {}
