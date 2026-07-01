package com.scalda.recipes.service;

import com.scalda.recipes.dto.MapIngredientRequest;
import com.scalda.recipes.dto.MappingResponse;

public interface MappingService {

    MappingResponse upsert(Long ingredienteId, MapIngredientRequest request);

    void delete(Long ingredienteId);
}
