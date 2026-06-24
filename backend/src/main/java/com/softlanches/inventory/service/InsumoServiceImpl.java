package com.softlanches.inventory.service;

import com.softlanches.inventory.dto.CreateInsumoRequest;
import com.softlanches.inventory.dto.InsumoResponse;
import com.softlanches.inventory.dto.UpdateInsumoRequest;
import com.softlanches.inventory.mapper.InsumoMapper;
import com.softlanches.inventory.model.Insumo;
import com.softlanches.inventory.repository.InsumoRepository;
import com.softlanches.recipes.repository.IngredientMappingRepository;
import com.softlanches.shared.dto.PageResponse;
import com.softlanches.shared.exception.ResourceNotFoundException;
import com.softlanches.shared.tenant.TenantContext;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
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
    public PageResponse<InsumoResponse> findAll(Pageable pageable) {
        UUID empresaId = TenantContext.getRequiredEmpresaId();
        return PageResponse.of(repository.findAllByEmpresaId(empresaId, pageable).map(mapper::toResponse));
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
        // P5: filtro na camada de banco — evita carregar todos os insumos em memória
        return mapper.toResponseList(
                repository.findAlertasByEmpresaId(empresaId, LocalDate.now().plusDays(7)));
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
