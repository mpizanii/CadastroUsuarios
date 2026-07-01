package com.scalda.orders.model;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum OrderStatus {

    PENDENTE("Pendente"),
    EM_PREPARO("Em Preparo"),
    EM_ROTA("Em Rota de Entrega"),
    ENTREGUE("Entregue"),
    CANCELADO("Cancelado");

    private final String valor;

    OrderStatus(String valor) {
        this.valor = valor;
    }

    @JsonValue
    public String getValor() {
        return valor;
    }

    @JsonCreator
    public static OrderStatus fromValor(String valor) {
        for (OrderStatus s : values()) {
            if (s.valor.equalsIgnoreCase(valor)) return s;
        }
        throw new IllegalArgumentException("Status inválido: " + valor +
                ". Valores aceitos: Pendente, Em Preparo, Em Rota de Entrega, Entregue, Cancelado");
    }
}
