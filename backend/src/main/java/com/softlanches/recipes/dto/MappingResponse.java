package com.softlanches.recipes.dto;

import java.math.BigDecimal;

public record MappingResponse(
        Long id,
        Long ingredienteId,
        Long insumoId,
        BigDecimal fatorConversao
) {}
