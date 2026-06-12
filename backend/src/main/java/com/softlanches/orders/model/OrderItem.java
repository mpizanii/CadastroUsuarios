package com.softlanches.orders.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

// Tabela pedidoprodutos não tem created_at, portanto não herda TenantAwareEntity.
@Entity
@Table(name = "pedidoprodutos")
@Getter
@Setter
@NoArgsConstructor
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pedido_id", nullable = false)
    private Order order;

    @Column(name = "produto_id", nullable = false)
    private Long produtoId;

    @Column(name = "quantidade", nullable = false)
    private Integer quantidade;

    @Column(name = "empresa_id")
    private UUID empresaId;
}
