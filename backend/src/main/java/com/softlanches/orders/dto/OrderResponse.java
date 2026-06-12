package com.softlanches.orders.dto;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;

public record OrderResponse(
        Long id,
        Long clienteId,
        String clienteNome,
        OffsetDateTime dataPedido,
        BigDecimal valorTotal,
        String status,
        String observacoes,
        List<OrderItemResponse> produtos
) {}
