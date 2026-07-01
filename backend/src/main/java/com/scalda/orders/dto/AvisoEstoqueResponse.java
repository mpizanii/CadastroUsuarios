package com.scalda.orders.dto;

import java.math.BigDecimal;

public record AvisoEstoqueResponse(
        String tipo,
        String mensagem,
        String insumoNome,
        BigDecimal quantidadeAtual,
        BigDecimal quantidadeNecessaria,
        BigDecimal quantidadeFaltante,
        String produtoNome
) {}
