package com.softlanches.inventory.service;

import com.softlanches.inventory.dto.CreateInsumoRequest;
import com.softlanches.inventory.dto.InsumoResponse;
import com.softlanches.inventory.dto.UpdateInsumoRequest;

import java.util.List;

public interface InsumoService {

    List<InsumoResponse> findAll();

    InsumoResponse findById(Long id);

    List<InsumoResponse> findAlertas();

    InsumoResponse create(CreateInsumoRequest request);

    InsumoResponse update(Long id, UpdateInsumoRequest request);

    void delete(Long id);
}
