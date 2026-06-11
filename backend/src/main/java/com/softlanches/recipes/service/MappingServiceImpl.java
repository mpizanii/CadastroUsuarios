package com.softlanches.recipes.service;

import com.softlanches.recipes.dto.MapIngredientRequest;
import com.softlanches.recipes.dto.MappingResponse;
import com.softlanches.recipes.model.IngredientMapping;
import com.softlanches.recipes.model.RecipeIngredient;
import com.softlanches.recipes.repository.IngredientMappingRepository;
import com.softlanches.recipes.repository.RecipeIngredientRepository;
import com.softlanches.shared.exception.ResourceNotFoundException;
import com.softlanches.shared.tenant.TenantContext;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
        mapping.setFatorConversao(request.fatorConversao() != null ? request.fatorConversao() : 1.0);
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
