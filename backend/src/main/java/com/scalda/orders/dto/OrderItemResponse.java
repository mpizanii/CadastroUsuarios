package com.scalda.orders.dto;

import java.math.BigDecimal;

public record OrderItemResponse(
        Long id,
        Long produtoId,
        String produtoNome,
        Integer quantidade,
        BigDecimal precoUnitario
) {}
