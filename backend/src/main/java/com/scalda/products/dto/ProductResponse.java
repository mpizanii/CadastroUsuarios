package com.scalda.products.dto;

import java.math.BigDecimal;

public record ProductResponse(
        Long id,
        String nome,
        BigDecimal preco,
        BigDecimal custo,
        boolean ativo,
        Long receitaId,
        double margem
) {}
