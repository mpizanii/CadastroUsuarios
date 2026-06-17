package com.softlanches.recipes.repository;

import com.softlanches.recipes.model.RecipeIngredient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface RecipeIngredientRepository extends JpaRepository<RecipeIngredient, Long> {

    Optional<RecipeIngredient> findByIdAndEmpresaId(Long id, UUID empresaId);

    List<RecipeIngredient> findAllByRecipe_Id(Long receitaId);

    @Query("SELECT i FROM RecipeIngredient i LEFT JOIN FETCH i.mapping WHERE i.recipe.id IN :receitaIds")
    List<RecipeIngredient> findAllByRecipe_IdInWithMapping(@Param("receitaIds") Collection<Long> receitaIds);
}
