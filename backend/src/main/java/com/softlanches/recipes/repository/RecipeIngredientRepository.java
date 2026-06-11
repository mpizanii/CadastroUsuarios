package com.softlanches.recipes.repository;

import com.softlanches.recipes.model.RecipeIngredient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface RecipeIngredientRepository extends JpaRepository<RecipeIngredient, Long> {

    Optional<RecipeIngredient> findByIdAndEmpresaId(Long id, UUID empresaId);
}
