package com.softlanches.inventory.dto;

import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.LocalDate;

public record UpdateInsumoRequest(

        @Size(min = 1, max = 255, message = "Nome deve ter entre 1 e 255 caracteres")
        String nome,

        @PositiveOrZero(message = "Quantidade não pode ser negativa")
        BigDecimal quantidade,

        @Size(max = 50, message = "Unidade deve ter no máximo 50 caracteres")
        String unidade,

        LocalDate validade,

        @PositiveOrZero(message = "Estoque mínimo não pode ser negativo")
        BigDecimal estoqueMinimo,

        Boolean removeMapping
) {}
