package com.softlanches.recipes.repository;

import com.softlanches.recipes.model.IngredientMapping;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface IngredientMappingRepository extends JpaRepository<IngredientMapping, Long> {

    void deleteAllByInsumoId(Long insumoId);

    Optional<IngredientMapping> findByRecipeIngredient_Id(Long ingredienteId);

    void deleteByRecipeIngredient_Id(Long ingredienteId);

    List<IngredientMapping> findAllByRecipeIngredient_IdIn(List<Long> ingredienteIds);
}
