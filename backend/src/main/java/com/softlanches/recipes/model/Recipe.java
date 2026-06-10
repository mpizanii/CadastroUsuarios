package com.softlanches.recipes.model;

import com.softlanches.shared.persistence.TenantAwareEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

// Stub — campos básicos para permitir cascade delete de produtos.
// Módulo Receitas expandirá esta entidade com ingredientes, serviços e controller.
@Entity
@Table(name = "receitas")
@Getter
@Setter
@NoArgsConstructor
public class Recipe extends TenantAwareEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "nome", nullable = false)
    private String nome;

    @Column(name = "modo_preparo")
    private String modoPreparo;
}
