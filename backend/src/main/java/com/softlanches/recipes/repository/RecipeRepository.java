package com.softlanches.recipes.repository;

import com.softlanches.recipes.model.Recipe;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface RecipeRepository extends JpaRepository<Recipe, Long> {

    List<Recipe> findAllByEmpresaId(UUID empresaId);

    Page<Recipe> findAllByEmpresaId(UUID empresaId, Pageable pageable);

    Optional<Recipe> findByIdAndEmpresaId(Long id, UUID empresaId);

    // Carrega receita + ingredientes + mapeamentos em uma única query (fix N+1)
    @Query("""
            SELECT DISTINCT r FROM Recipe r
            LEFT JOIN FETCH r.ingredients i
            LEFT JOIN FETCH i.mapping
            WHERE r.id = :id AND r.empresaId = :empresaId
            """)
    Optional<Recipe> findByIdWithIngredientsAndMappings(
            @Param("id") Long id,
            @Param("empresaId") UUID empresaId);

    // Carrega receita + ingredientes sem mapeamento (para endpoint /ingredientes)
    @Query("""
            SELECT DISTINCT r FROM Recipe r
            LEFT JOIN FETCH r.ingredients
            WHERE r.id = :id AND r.empresaId = :empresaId
            """)
    Optional<Recipe> findByIdWithIngredients(
            @Param("id") Long id,
            @Param("empresaId") UUID empresaId);
}
