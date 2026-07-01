package com.scalda.products.service;

import com.scalda.products.dto.CreateProductRequest;
import com.scalda.products.dto.ProductResponse;
import com.scalda.products.dto.UpdateProductRequest;
import com.scalda.products.mapper.ProductMapper;
import com.scalda.products.model.Product;
import com.scalda.products.repository.ProductRepository;
import com.scalda.recipes.repository.RecipeRepository;
import com.scalda.shared.dto.PageResponse;
import com.scalda.shared.exception.ResourceNotFoundException;
import com.scalda.shared.tenant.TenantContext;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class ProductServiceImpl implements ProductService {

    private final ProductRepository repository;
    private final ProductMapper mapper;
    private final RecipeRepository recipeRepository;

    @Override
    @Transactional(readOnly = true)
    public List<ProductResponse> findAll() {
        UUID empresaId = TenantContext.getRequiredEmpresaId();
        return mapper.toResponseList(repository.findAllByEmpresaId(empresaId));
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<ProductResponse> findAll(Pageable pageable) {
        UUID empresaId = TenantContext.getRequiredEmpresaId();
        return PageResponse.of(repository.findAllByEmpresaId(empresaId, pageable).map(mapper::toResponse));
    }

    @Override
    @Transactional(readOnly = true)
    public ProductResponse findById(Long id) {
        UUID empresaId = TenantContext.getRequiredEmpresaId();
        Product product = repository.findByIdAndEmpresaId(id, empresaId)
                .orElseThrow(() -> new ResourceNotFoundException("Produto", id));
        return mapper.toResponse(product);
    }

    @Override
    @Transactional(readOnly = true)
    public ProductResponse findByReceitaId(Long receitaId) {
        UUID empresaId = TenantContext.getRequiredEmpresaId();
        Product product = repository.findByReceitaIdAndEmpresaId(receitaId, empresaId)
                .orElseThrow(() -> new ResourceNotFoundException("Produto com receitaId", receitaId));
        return mapper.toResponse(product);
    }

    @Override
    public ProductResponse create(CreateProductRequest request) {
        UUID empresaId = TenantContext.getRequiredEmpresaId();
        Product product = mapper.toEntity(request);
        product.setEmpresaId(empresaId);
        return mapper.toResponse(repository.save(product));
    }

    @Override
    public ProductResponse update(Long id, UpdateProductRequest request) {
        UUID empresaId = TenantContext.getRequiredEmpresaId();
        Product product = repository.findByIdAndEmpresaId(id, empresaId)
                .orElseThrow(() -> new ResourceNotFoundException("Produto", id));
        mapper.updateEntity(request, product);
        return mapper.toResponse(repository.save(product));
    }

    @Override
    public void delete(Long id) {
        UUID empresaId = TenantContext.getRequiredEmpresaId();
        Product product = repository.findByIdAndEmpresaId(id, empresaId)
                .orElseThrow(() -> new ResourceNotFoundException("Produto", id));

        // Cascade: receita vinculada ao produto é deletada junto.
        // A receita pertence ao mesmo tenant (foi criada pelo mesmo usuário).
        if (product.getReceitaId() != null) {
            recipeRepository.deleteById(product.getReceitaId());
        }

        repository.delete(product);
    }
}
