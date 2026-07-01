package com.scalda.recipes.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.UUID;

// Tabela ingredientes_insumo tem empresa_id mas NÃO tem created_at.
@Entity
@Table(name = "ingredientes_insumo")
@Getter
@Setter
@NoArgsConstructor
public class IngredientMapping {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ingrediente_id", nullable = false)
    private RecipeIngredient recipeIngredient;

    @Column(name = "insumo_id", nullable = false)
    private Long insumoId;

    @Column(name = "fator_conversao")
    private BigDecimal fatorConversao;

    @Column(name = "empresa_id")
    private UUID empresaId;
}
