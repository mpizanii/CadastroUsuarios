package com.scalda.orders.dto;

import java.util.List;

public record VerificarEstoqueResponse(
        boolean temAvisos,
        List<AvisoEstoqueResponse> avisos
) {}
