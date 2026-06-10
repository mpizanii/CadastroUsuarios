package com.softlanches.customers.mapper;

import com.softlanches.customers.dto.CreateCustomerRequest;
import com.softlanches.customers.dto.CustomerResponse;
import com.softlanches.customers.dto.UpdateCustomerRequest;
import com.softlanches.customers.model.Customer;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring")
public interface CustomerMapper {

    CustomerResponse toResponse(Customer customer);

    List<CustomerResponse> toResponseList(List<Customer> customers);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "empresaId", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    Customer toEntity(CreateCustomerRequest request);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "empresaId", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    void updateEntity(UpdateCustomerRequest request, @MappingTarget Customer customer);
}
