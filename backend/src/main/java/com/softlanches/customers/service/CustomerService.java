package com.softlanches.customers.service;

import com.softlanches.customers.dto.CreateCustomerRequest;
import com.softlanches.customers.dto.CustomerResponse;
import com.softlanches.customers.dto.UpdateCustomerRequest;
import com.softlanches.shared.dto.PageResponse;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface CustomerService {

    List<CustomerResponse> findAll();

    PageResponse<CustomerResponse> findAll(Pageable pageable);

    CustomerResponse findById(Long id);

    CustomerResponse create(CreateCustomerRequest request);

    CustomerResponse update(Long id, UpdateCustomerRequest request);

    void delete(Long id);
}
