package com.softlanches.recipes.repository;

import com.softlanches.recipes.model.Recipe;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

// Stub — será expandido quando o módulo Receitas for implementado.
@Repository
public interface RecipeRepository extends JpaRepository<Recipe, Long> {

    Optional<Recipe> findByIdAndEmpresaId(Long id, UUID empresaId);
}
