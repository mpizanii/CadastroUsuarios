package com.softlanches.orders.controller;

import com.softlanches.orders.dto.*;
import com.softlanches.orders.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/pedidos")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @GetMapping
    public ResponseEntity<List<OrderResponse>> findAll() {
        return ResponseEntity.ok(orderService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderResponse> findById(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.findById(id));
    }

    @PostMapping
    public ResponseEntity<OrderResponse> create(@Valid @RequestBody CreateOrderRequest request) {
        OrderResponse created = orderService.create(request);
        return ResponseEntity.created(URI.create("/api/pedidos/" + created.id())).body(created);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<OrderResponse> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateOrderStatusRequest request) {
        return ResponseEntity.ok(orderService.updateStatus(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        orderService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/verificar-mapeamento")
    public ResponseEntity<VerificarMapeamentoResponse> verificarMapeamento(
            @Valid @RequestBody List<OrderItemRequest> produtos) {
        return ResponseEntity.ok(orderService.verificarMapeamento(produtos));
    }

    @PostMapping("/verificar-estoque")
    public ResponseEntity<VerificarEstoqueResponse> verificarEstoque(
            @Valid @RequestBody List<OrderItemRequest> produtos) {
        return ResponseEntity.ok(orderService.verificarEstoque(produtos));
    }

    @PostMapping("/{id}/baixa-estoque")
    public ResponseEntity<Void> darBaixaEstoque(@PathVariable Long id) {
        orderService.darBaixaEstoque(id);
        return ResponseEntity.ok().build();
    }
}
