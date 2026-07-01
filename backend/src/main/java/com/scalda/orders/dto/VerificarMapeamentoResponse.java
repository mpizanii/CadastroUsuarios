package com.scalda.orders.dto;

import java.util.List;

public record VerificarMapeamentoResponse(
        boolean todosMapeados,
        List<IngredienteNaoMapeadoResponse> ingredientesNaoMapeados
) {}
