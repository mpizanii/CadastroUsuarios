package com.softlanches.orders.service;

import com.softlanches.orders.dto.*;

import java.util.List;

public interface OrderService {

    List<OrderResponse> findAll();

    OrderResponse findById(Long id);

    OrderResponse create(CreateOrderRequest request);

    OrderResponse updateStatus(Long id, UpdateOrderStatusRequest request);

    void delete(Long id);

    VerificarMapeamentoResponse verificarMapeamento(List<OrderItemRequest> produtos);

    VerificarEstoqueResponse verificarEstoque(List<OrderItemRequest> produtos);

    void darBaixaEstoque(Long pedidoId);
}
