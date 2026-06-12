package com.softlanches.orders.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

// Tabela pedidos NÃO tem created_at, por isso não herda TenantAwareEntity.
@Entity
@Table(name = "pedidos")
@Getter
@Setter
@NoArgsConstructor
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "empresa_id", nullable = false, updatable = false, columnDefinition = "uuid")
    private UUID empresaId;

    @Column(name = "cliente_id")
    private Long clienteId;

    @Column(name = "data")
    private OffsetDateTime data;

    @Column(name = "valor", nullable = false)
    private BigDecimal valor;

    @Column(name = "status")
    private String status = "Pendente";

    @Column(name = "observacoes")
    private String observacoes;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<OrderItem> items = new ArrayList<>();
}
