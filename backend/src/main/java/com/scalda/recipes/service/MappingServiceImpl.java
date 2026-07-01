package com.scalda.recipes.service;

import com.scalda.recipes.dto.MapIngredientRequest;
import com.scalda.recipes.dto.MappingResponse;
import com.scalda.recipes.model.IngredientMapping;
import com.scalda.recipes.model.RecipeIngredient;
import com.scalda.recipes.repository.IngredientMappingRepository;
import com.scalda.recipes.repository.RecipeIngredientRepository;
import com.scalda.shared.exception.ResourceNotFoundException;
import com.scalda.shared.tenant.TenantContext;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class MappingServiceImpl implements MappingService {

    private final RecipeIngredientRepository recipeIngredientRepository;
    private final IngredientMappingRepository ingredientMappingRepository;

    @Override
    public MappingResponse upsert(Long ingredienteId, MapIngredientRequest request) {
        UUID empresaId = TenantContext.getRequiredEmpresaId();

        RecipeIngredient ingredient = recipeIngredientRepository
                .findByIdAndEmpresaId(ingredienteId, empresaId)
                .orElseThrow(() -> new ResourceNotFoundException("Ingrediente", ingredienteId));

        IngredientMapping mapping = ingredientMappingRepository
                .findByRecipeIngredient_Id(ingredienteId)
                .orElseGet(IngredientMapping::new);

        mapping.setRecipeIngredient(ingredient);
        mapping.setInsumoId(request.insumoId());
        mapping.setFatorConversao(request.fatorConversao() != null ? request.fatorConversao() : BigDecimal.ONE);
        mapping.setEmpresaId(empresaId);

        IngredientMapping saved = ingredientMappingRepository.save(mapping);
        return toResponse(saved);
    }

    @Override
    public void delete(Long ingredienteId) {
        UUID empresaId = TenantContext.getRequiredEmpresaId();

        recipeIngredientRepository
                .findByIdAndEmpresaId(ingredienteId, empresaId)
                .orElseThrow(() -> new ResourceNotFoundException("Ingrediente", ingredienteId));

        ingredientMappingRepository.deleteByRecipeIngredient_Id(ingredienteId);
    }

    private MappingResponse toResponse(IngredientMapping mapping) {
        return new MappingResponse(
                mapping.getId(),
                mapping.getRecipeIngredient().getId(),
                mapping.getInsumoId(),
                mapping.getFatorConversao()
        );
    }
}
