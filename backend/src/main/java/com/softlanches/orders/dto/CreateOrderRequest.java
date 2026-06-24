package com.softlanches.orders.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;

import java.util.List;

public record CreateOrderRequest(
        Long clienteId,
        String observacoes,
        @NotEmpty @Valid List<OrderItemRequest> produtos,
        boolean darBaixaEstoque
) {}
