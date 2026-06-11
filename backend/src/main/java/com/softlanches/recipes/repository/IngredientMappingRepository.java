package com.softlanches.recipes.repository;

import com.softlanches.recipes.model.IngredientMapping;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IngredientMappingRepository extends JpaRepository<IngredientMapping, Long> {

    void deleteAllByInsumoId(Long insumoId);
}
