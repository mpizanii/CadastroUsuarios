package com.softlanches.recipes.service;

import com.softlanches.inventory.model.Insumo;
import com.softlanches.inventory.repository.InsumoRepository;
import com.softlanches.recipes.dto.*;
import com.softlanches.recipes.mapper.RecipeMapper;
import com.softlanches.recipes.model.IngredientMapping;
import com.softlanches.recipes.model.Recipe;
import com.softlanches.recipes.model.RecipeIngredient;
import com.softlanches.recipes.repository.RecipeRepository;
import com.softlanches.shared.exception.ResourceNotFoundException;
import com.softlanches.shared.tenant.TenantContext;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class RecipeServiceImpl implements RecipeService {

    private final RecipeRepository recipeRepository;
    private final InsumoRepository insumoRepository;
    private final RecipeMapper mapper;

    @Override
    @Transactional(readOnly = true)
    public List<RecipeResponse> findAll() {
        UUID empresaId = TenantContext.getRequiredEmpresaId();
        return mapper.toResponseList(recipeRepository.findAllByEmpresaId(empresaId));
    }

    @Override
    @Transactional(readOnly = true)
    public RecipeDetailResponse findById(Long id) {
        UUID empresaId = TenantContext.getRequiredEmpresaId();

        // Query 1: receita + ingredientes + mapeamentos (JOIN FETCH — sem N+1)
        Recipe recipe = recipeRepository.findByIdWithIngredientsAndMappings(id, empresaId)
                .orElseThrow(() -> new ResourceNotFoundException("Receita", id));

        // Query 2: nomes dos insumos em batch (1 query com IN clause)
        List<Long> insumoIds = recipe.getIngredients().stream()
                .filter(i -> i.getMapping() != null)
                .map(i -> i.getMapping().getInsumoId())
                .distinct()
                .toList();

        Map<Long, String> insumoNames = insumoIds.isEmpty()
                ? Collections.emptyMap()
                : insumoRepository.findAllByIdIn(insumoIds).stream()
                        .collect(Collectors.toMap(Insumo::getId, Insumo::getNome));

        List<IngredientWithMappingResponse> ingredientes = recipe.getIngredients().stream()
                .map(ingredient -> toIngredientWithMapping(ingredient, insumoNames))
                .toList();

        return new RecipeDetailResponse(
                recipe.getId(),
                recipe.getNome(),
                recipe.getModoPreparo(),
                recipe.getCreatedAt(),
                ingredientes
        );
    }

    @Override
    @Transactional(readOnly = true)
    public List<IngredientResponse> findIngredientsByRecipeId(Long recipeId) {
        UUID empresaId = TenantContext.getRequiredEmpresaId();
        Recipe recipe = recipeRepository.findByIdWithIngredients(recipeId, empresaId)
                .orElseThrow(() -> new ResourceNotFoundException("Receita", recipeId));
        return mapper.toIngredientResponseList(recipe.getIngredients());
    }

    @Override
    public RecipeDetailResponse create(CreateRecipeRequest request) {
        UUID empresaId = TenantContext.getRequiredEmpresaId();

        Recipe recipe = new Recipe();
        recipe.setNome(request.nome());
        recipe.setModoPreparo(request.modoPreparo() != null ? request.modoPreparo() : "");
        recipe.setEmpresaId(empresaId);

        if (request.ingredientes() != null) {
            for (CreateIngredientRequest ingReq : request.ingredientes()) {
                RecipeIngredient ingredient = new RecipeIngredient();
                ingredient.setNome(ingReq.nome());
                ingredient.setQuantidade(ingReq.quantidade());
                ingredient.setUnidade(ingReq.unidade());
                ingredient.setEmpresaId(empresaId);
                ingredient.setRecipe(recipe);
                recipe.getIngredients().add(ingredient);
            }
        }

        // Único save com CascadeType.ALL — sem o problema de dois saves sem transação do C#
        Recipe saved = recipeRepository.save(recipe);

        List<IngredientWithMappingResponse> ingredientes = saved.getIngredients().stream()
                .map(i -> toIngredientWithMapping(i, Collections.emptyMap()))
                .toList();

        return new RecipeDetailResponse(
                saved.getId(),
                saved.getNome(),
                saved.getModoPreparo(),
                saved.getCreatedAt(),
                ingredientes
        );
    }

    @Override
    public void delete(Long id) {
        UUID empresaId = TenantContext.getRequiredEmpresaId();
        Recipe recipe = recipeRepository.findByIdAndEmpresaId(id, empresaId)
                .orElseThrow(() -> new ResourceNotFoundException("Receita", id));
        // CascadeType.ALL + orphanRemoval=true propaga delete para ingredientes e mapeamentos
        recipeRepository.delete(recipe);
    }

    private IngredientWithMappingResponse toIngredientWithMapping(
            RecipeIngredient ingredient,
            Map<Long, String> insumoNames) {

        IngredientMapping mapping = ingredient.getMapping();
        return new IngredientWithMappingResponse(
                ingredient.getId(),
                ingredient.getNome(),
                ingredient.getQuantidade(),
                ingredient.getUnidade(),
                mapping != null,
                mapping != null ? mapping.getInsumoId() : null,
                mapping != null ? insumoNames.get(mapping.getInsumoId()) : null,
                mapping != null ? mapping.getFatorConversao() : null
        );
    }
}
