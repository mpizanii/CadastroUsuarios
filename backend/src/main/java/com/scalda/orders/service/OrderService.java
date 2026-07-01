package com.scalda.orders.service;

import com.scalda.orders.dto.*;
import com.scalda.shared.dto.PageResponse;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface OrderService {

    List<OrderResponse> findAll();

    PageResponse<OrderResponse> findAll(Pageable pageable);

    OrderResponse findById(Long id);

    OrderResponse create(CreateOrderRequest request);

    OrderResponse updateStatus(Long id, UpdateOrderStatusRequest request);

    void delete(Long id);

    VerificarMapeamentoResponse verificarMapeamento(List<OrderItemRequest> produtos);

    VerificarEstoqueResponse verificarEstoque(List<OrderItemRequest> produtos);

    void darBaixaEstoque(Long pedidoId);
}
