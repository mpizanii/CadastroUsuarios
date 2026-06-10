package com.softlanches.recipes.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

// Tabela "receitaIngredientes" tem empresa_id mas NÃO tem created_at,
// por isso não herda de TenantAwareEntity.
@Entity
@Table(name = "`receitaIngredientes`")
@Getter
@Setter
@NoArgsConstructor
public class RecipeIngredient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "receita_id")
    private Recipe recipe;

    @Column(name = "nome", nullable = false)
    private String nome;

    @Column(name = "quantidade", nullable = false)
    private double quantidade;

    @Column(name = "unidade", nullable = false)
    private String unidade;

    @Column(name = "empresa_id")
    private UUID empresaId;

    // Mapeamento opcional para insumo de estoque (pode ser null se ainda não mapeado)
    @OneToOne(mappedBy = "recipeIngredient", cascade = CascadeType.ALL, optional = true, fetch = FetchType.LAZY)
    private IngredientMapping mapping;
}
