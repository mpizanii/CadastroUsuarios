package com.scalda.customers.service;

import com.scalda.customers.dto.CreateCustomerRequest;
import com.scalda.customers.dto.CustomerResponse;
import com.scalda.customers.dto.UpdateCustomerRequest;
import com.scalda.shared.dto.PageResponse;
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
