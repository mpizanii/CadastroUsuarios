package com.scalda.products.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

// PUT semântica: todos os campos de dados são obrigatórios (full replace).
// receitaId é nullable — enviar null desvincula a receita sem deletá-la.
public record UpdateProductRequest(

        @NotBlank(message = "Nome é obrigatório")
        @Size(max = 255, message = "Nome deve ter no máximo 255 caracteres")
        String nome,

        @NotNull(message = "Preço é obrigatório")
        @PositiveOrZero(message = "Preço não pode ser negativo")
        BigDecimal preco,

        @NotNull(message = "Custo é obrigatório")
        @PositiveOrZero(message = "Custo não pode ser negativo")
        BigDecimal custo,

        @NotNull(message = "Campo ativo é obrigatório")
        Boolean ativo,

        Long receitaId
) {}
