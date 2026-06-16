package com.softlanches.products.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public record CreateProductRequest(

        @NotBlank(message = "Nome é obrigatório")
        @Size(max = 255, message = "Nome deve ter no máximo 255 caracteres")
        String nome,

        @PositiveOrZero(message = "Preço não pode ser negativo")
        BigDecimal preco,

        @PositiveOrZero(message = "Custo não pode ser negativo")
        BigDecimal custo,

        Boolean ativo,

        Long receitaId
) {}
