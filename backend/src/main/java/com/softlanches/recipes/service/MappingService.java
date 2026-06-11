package com.softlanches.recipes.service;

import com.softlanches.recipes.dto.MapIngredientRequest;
import com.softlanches.recipes.dto.MappingResponse;

public interface MappingService {

    MappingResponse upsert(Long ingredienteId, MapIngredientRequest request);

    void delete(Long ingredienteId);
}
