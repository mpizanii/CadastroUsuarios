package com.softlanches.recipes.controller;

import com.softlanches.recipes.dto.CreateRecipeRequest;
import com.softlanches.recipes.dto.IngredientResponse;
import com.softlanches.recipes.dto.RecipeDetailResponse;
import com.softlanches.recipes.dto.RecipeResponse;
import com.softlanches.recipes.service.RecipeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/receitas")
@RequiredArgsConstructor
public class RecipeController {

    private final RecipeService service;

    @GetMapping
    public ResponseEntity<List<RecipeResponse>> findAll() {
        return ResponseEntity.ok(service.findAll());
    }

    // Retorna receita com detalhes de mapeamento ingrediente→insumo (N+1 corrigido)
    @GetMapping("/{id}")
    public ResponseEntity<RecipeDetailResponse> findById(@PathVariable Long id) {
        return ResponseEntity.ok(service.findById(id));
    }

    // Substitui a rota incorreta /api/ingredientes/{id} do C#
    @GetMapping("/{id}/ingredientes")
    public ResponseEntity<List<IngredientResponse>> findIngredients(@PathVariable Long id) {
        return ResponseEntity.ok(service.findIngredientsByRecipeId(id));
    }

    @PostMapping
    public ResponseEntity<RecipeDetailResponse> create(@Valid @RequestBody CreateRecipeRequest request) {
        RecipeDetailResponse response = service.create(request);
        URI location = URI.create("/api/receitas/" + response.id());
        return ResponseEntity.created(location).body(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
