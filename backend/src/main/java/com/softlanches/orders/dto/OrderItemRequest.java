package com.softlanches.orders.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record OrderItemRequest(
        @NotNull @Positive Long produtoId,
        @NotNull @Positive Integer quantidade,
        double precoUnitario
) {}
