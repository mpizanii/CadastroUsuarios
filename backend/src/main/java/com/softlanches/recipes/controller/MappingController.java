package com.softlanches.recipes.controller;

import com.softlanches.recipes.dto.MapIngredientRequest;
import com.softlanches.recipes.dto.MappingResponse;
import com.softlanches.recipes.service.MappingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/receitas/ingredientes")
@RequiredArgsConstructor
public class MappingController {

    private final MappingService mappingService;

    @PutMapping("/{ingredienteId}/mapeamento")
    public ResponseEntity<MappingResponse> upsert(
            @PathVariable Long ingredienteId,
            @Valid @RequestBody MapIngredientRequest request) {
        return ResponseEntity.ok(mappingService.upsert(ingredienteId, request));
    }

    @DeleteMapping("/{ingredienteId}/mapeamento")
    public ResponseEntity<Void> delete(@PathVariable Long ingredienteId) {
        mappingService.delete(ingredienteId);
        return ResponseEntity.noContent().build();
    }
}
