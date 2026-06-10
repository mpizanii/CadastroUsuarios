package com.softlanches.customers.service;

import com.softlanches.customers.dto.CreateCustomerRequest;
import com.softlanches.customers.dto.CustomerResponse;
import com.softlanches.customers.dto.UpdateCustomerRequest;

import java.util.List;

public interface CustomerService {

    List<CustomerResponse> findAll();

    CustomerResponse findById(Long id);

    CustomerResponse create(CreateCustomerRequest request);

    CustomerResponse update(Long id, UpdateCustomerRequest request);

    void delete(Long id);
}
