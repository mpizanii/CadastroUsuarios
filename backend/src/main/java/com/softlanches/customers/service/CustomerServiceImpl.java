package com.softlanches.customers.service;

import com.softlanches.customers.dto.CreateCustomerRequest;
import com.softlanches.customers.dto.CustomerResponse;
import com.softlanches.customers.dto.UpdateCustomerRequest;
import com.softlanches.customers.mapper.CustomerMapper;
import com.softlanches.customers.model.Customer;
import com.softlanches.customers.repository.CustomerRepository;
import com.softlanches.shared.dto.PageResponse;
import com.softlanches.shared.exception.ResourceNotFoundException;
import com.softlanches.shared.tenant.TenantContext;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class CustomerServiceImpl implements CustomerService {

    private final CustomerRepository repository;
    private final CustomerMapper mapper;

    @Override
    @Transactional(readOnly = true)
    public List<CustomerResponse> findAll() {
        UUID empresaId = TenantContext.getRequiredEmpresaId();
        return mapper.toResponseList(repository.findAllByEmpresaId(empresaId));
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<CustomerResponse> findAll(Pageable pageable) {
        UUID empresaId = TenantContext.getRequiredEmpresaId();
        return PageResponse.of(repository.findAllByEmpresaId(empresaId, pageable).map(mapper::toResponse));
    }

    @Override
    @Transactional(readOnly = true)
    public CustomerResponse findById(Long id) {
        UUID empresaId = TenantContext.getRequiredEmpresaId();
        Customer customer = repository.findByIdAndEmpresaId(id, empresaId)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente", id));
        return mapper.toResponse(customer);
    }

    @Override
    public CustomerResponse create(CreateCustomerRequest request) {
        UUID empresaId = TenantContext.getRequiredEmpresaId();
        Customer customer = mapper.toEntity(request);
        customer.setEmpresaId(empresaId);
        return mapper.toResponse(repository.save(customer));
    }

    @Override
    public CustomerResponse update(Long id, UpdateCustomerRequest request) {
        UUID empresaId = TenantContext.getRequiredEmpresaId();
        Customer customer = repository.findByIdAndEmpresaId(id, empresaId)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente", id));
        mapper.updateEntity(request, customer);
        return mapper.toResponse(repository.save(customer));
    }

    @Override
    public void delete(Long id) {
        UUID empresaId = TenantContext.getRequiredEmpresaId();
        Customer customer = repository.findByIdAndEmpresaId(id, empresaId)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente", id));
        repository.delete(customer);
    }
}
