package com.softlanches.inventory.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

// Stub — mapeamento mínimo para consulta de nome do insumo no módulo Receitas.
// Módulo Insumos expandirá esta entidade com todos os campos e comportamentos.
@Entity
@Table(name = "insumos")
@Getter
@NoArgsConstructor
public class Insumo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "nome")
    private String nome;
}
