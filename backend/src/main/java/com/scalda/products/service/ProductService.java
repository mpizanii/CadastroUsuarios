package com.scalda.products.service;

import com.scalda.products.dto.CreateProductRequest;
import com.scalda.products.dto.ProductResponse;
import com.scalda.products.dto.UpdateProductRequest;
import com.scalda.shared.dto.PageResponse;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ProductService {

    List<ProductResponse> findAll();

    PageResponse<ProductResponse> findAll(Pageable pageable);

    ProductResponse findById(Long id);

    ProductResponse findByReceitaId(Long receitaId);

    ProductResponse create(CreateProductRequest request);

    ProductResponse update(Long id, UpdateProductRequest request);

    void delete(Long id);
}
