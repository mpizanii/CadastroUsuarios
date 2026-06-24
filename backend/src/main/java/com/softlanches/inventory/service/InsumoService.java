package com.softlanches.inventory.service;

import com.softlanches.inventory.dto.CreateInsumoRequest;
import com.softlanches.inventory.dto.InsumoResponse;
import com.softlanches.inventory.dto.UpdateInsumoRequest;
import com.softlanches.shared.dto.PageResponse;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface InsumoService {

    List<InsumoResponse> findAll();

    PageResponse<InsumoResponse> findAll(Pageable pageable);

    InsumoResponse findById(Long id);

    List<InsumoResponse> findAlertas();

    InsumoResponse create(CreateInsumoRequest request);

    InsumoResponse update(Long id, UpdateInsumoRequest request);

    void delete(Long id);
}
