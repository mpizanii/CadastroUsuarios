package com.softlanches.inventory.service;

import com.softlanches.inventory.dto.CreateInsumoRequest;
import com.softlanches.inventory.dto.InsumoResponse;
import com.softlanches.inventory.dto.UpdateInsumoRequest;
import com.softlanches.inventory.mapper.InsumoMapper;
import com.softlanches.inventory.model.Insumo;
import com.softlanches.inventory.repository.InsumoRepository;
import com.softlanches.recipes.repository.IngredientMappingRepository;
import com.softlanches.shared.exception.ResourceNotFoundException;
import com.softlanches.shared.tenant.TenantContext;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class InsumoServiceImpl implements InsumoService {

    private final InsumoRepository repository;
    private final InsumoMapper mapper;
    private final IngredientMappingRepository ingredientMappingRepository;

    @Override
    @Transactional(readOnly = true)
    public List<InsumoResponse> findAll() {
        UUID empresaId = TenantContext.getRequiredEmpresaId();
        return mapper.toResponseList(repository.findAllByEmpresaId(empresaId));
    }

    @Override
    @Transactional(readOnly = true)
    public InsumoResponse findById(Long id) {
        UUID empresaId = TenantContext.getRequiredEmpresaId();
        Insumo insumo = repository.findByIdAndEmpresaId(id, empresaId)
                .orElseThrow(() -> new ResourceNotFoundException("Insumo", id));
        return mapper.toResponse(insumo);
    }

    @Override
    @Transactional(readOnly = true)
    public List<InsumoResponse> findAlertas() {
        UUID empresaId = TenantContext.getRequiredEmpresaId();
        return repository.findAllByEmpresaId(empresaId).stream()
                .map(mapper::toResponse)
                .filter(r -> !r.statusEstoque().equals("OK"))
                .toList();
    }

    @Override
    public InsumoResponse create(CreateInsumoRequest request) {
        UUID empresaId = TenantContext.getRequiredEmpresaId();
        Insumo insumo = mapper.toEntity(request);
        insumo.setEmpresaId(empresaId);
        return mapper.toResponse(repository.save(insumo));
    }

    @Override
    public InsumoResponse update(Long id, UpdateInsumoRequest request) {
        UUID empresaId = TenantContext.getRequiredEmpresaId();
        Insumo insumo = repository.findByIdAndEmpresaId(id, empresaId)
                .orElseThrow(() -> new ResourceNotFoundException("Insumo", id));

        if (Boolean.TRUE.equals(request.removeMapping())) {
            ingredientMappingRepository.deleteAllByInsumoId(id);
        }

        mapper.updateEntity(request, insumo);
        return mapper.toResponse(repository.save(insumo));
    }

    @Override
    public void delete(Long id) {
        UUID empresaId = TenantContext.getRequiredEmpresaId();
        Insumo insumo = repository.findByIdAndEmpresaId(id, empresaId)
                .orElseThrow(() -> new ResourceNotFoundException("Insumo", id));
        repository.delete(insumo);
    }
}
