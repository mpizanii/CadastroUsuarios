package com.softlanches.products.model;

import com.softlanches.shared.persistence.TenantAwareEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Table(name = "produtos")
@Getter
@Setter
@NoArgsConstructor
public class Product extends TenantAwareEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "nome", nullable = false)
    private String nome;

    @Column(name = "preco", nullable = false)
    private BigDecimal preco;

    @Column(name = "custo", nullable = false)
    private BigDecimal custo;

    @Column(name = "ativo", nullable = false)
    private boolean ativo = true;

    // FK para receitas — nullable (produto pode não ter receita associada)
    @Column(name = "receita_id")
    private Long receitaId;
}
