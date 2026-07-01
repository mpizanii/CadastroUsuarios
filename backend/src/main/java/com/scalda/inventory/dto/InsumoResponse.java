package com.scalda.inventory.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;

public record InsumoResponse(
        Long id,
        String nome,
        BigDecimal quantidade,
        String unidade,
        LocalDate validade,
        BigDecimal estoqueMinimo,
        OffsetDateTime createdAt,
        String statusEstoque
) {}
