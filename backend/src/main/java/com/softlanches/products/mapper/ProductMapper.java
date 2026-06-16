package com.softlanches.products.mapper;

import com.softlanches.products.dto.CreateProductRequest;
import com.softlanches.products.dto.ProductResponse;
import com.softlanches.products.dto.UpdateProductRequest;
import com.softlanches.products.model.Product;
import org.mapstruct.*;

import java.math.BigDecimal;
import java.util.List;

@Mapper(componentModel = "spring")
public interface ProductMapper {

    @Mapping(
            target = "margem",
            expression = "java(product.getPreco() != null && product.getPreco().compareTo(java.math.BigDecimal.ZERO) > 0 ? product.getPreco().subtract(product.getCusto()).divide(product.getPreco(), 6, java.math.RoundingMode.HALF_UP).multiply(java.math.BigDecimal.valueOf(100)).doubleValue() : 0.0)"
    )
    ProductResponse toResponse(Product product);

    List<ProductResponse> toResponseList(List<Product> products);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "empresaId", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "preco", expression = "java(request.preco() != null ? request.preco() : java.math.BigDecimal.ZERO)")
    @Mapping(target = "custo", expression = "java(request.custo() != null ? request.custo() : java.math.BigDecimal.ZERO)")
    @Mapping(target = "ativo", expression = "java(request.ativo() != null ? request.ativo() : true)")
    Product toEntity(CreateProductRequest request);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "empresaId", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    void updateEntity(UpdateProductRequest request, @MappingTarget Product product);
}
