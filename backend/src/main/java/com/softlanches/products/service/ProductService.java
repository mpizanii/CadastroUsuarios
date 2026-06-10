package com.softlanches.products.service;

import com.softlanches.products.dto.CreateProductRequest;
import com.softlanches.products.dto.ProductResponse;
import com.softlanches.products.dto.UpdateProductRequest;

import java.util.List;

public interface ProductService {

    List<ProductResponse> findAll();

    ProductResponse findById(Long id);

    ProductResponse findByReceitaId(Long receitaId);

    ProductResponse create(CreateProductRequest request);

    ProductResponse update(Long id, UpdateProductRequest request);

    void delete(Long id);
}
