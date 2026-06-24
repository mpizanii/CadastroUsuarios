package com.softlanches.inventory.model;

import com.softlanches.shared.persistence.TenantAwareEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "insumos")
@Getter
@Setter
@NoArgsConstructor
public class Insumo extends TenantAwareEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "nome", nullable = false)
    private String nome;

    @Column(name = "quantidade", nullable = false)
    private BigDecimal quantidade;

    @Column(name = "unidade", nullable = false)
    private String unidade;

    @Column(name = "validade")
    private LocalDate validade;

    @Column(name = "estoque_minimo")
    private BigDecimal estoqueMinimo;
}
