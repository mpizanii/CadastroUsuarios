package com.softlanches.products.mapper;

import com.softlanches.products.dto.CreateProductRequest;
import com.softlanches.products.dto.ProductResponse;
import com.softlanches.products.dto.UpdateProductRequest;
import com.softlanches.products.model.Product;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ProductMapper {

    @Mapping(
            target = "margem",
            expression = "java(product.getPreco() > 0 ? ((product.getPreco() - product.getCusto()) / product.getPreco()) * 100 : 0.0)"
    )
    ProductResponse toResponse(Product product);

    List<ProductResponse> toResponseList(List<Product> products);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "empresaId", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "preco", expression = "java(request.preco() != null ? request.preco() : 0.0)")
    @Mapping(target = "custo", expression = "java(request.custo() != null ? request.custo() : 0.0)")
    @Mapping(target = "ativo", expression = "java(request.ativo() != null ? request.ativo() : true)")
    Product toEntity(CreateProductRequest request);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "empresaId", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    void updateEntity(UpdateProductRequest request, @MappingTarget Product product);
}
