package com.scalda.orders.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;

import java.math.BigDecimal;

public record OrderItemRequest(
        @NotNull @Positive Long produtoId,
        @NotNull @Positive Integer quantidade,
        /**
         * Informativo — ignorado quando o produto existe no banco (preço real é usado).
         * Aceito como fallback para produtos removidos. Null é permitido.
         */
        @PositiveOrZero BigDecimal precoUnitario
) {}
