package com.softlanches.recipes.dto;

public record MappingResponse(
        Long id,
        Long ingredienteId,
        Long insumoId,
        Double fatorConversao
) {}
