package com.softlanches.customers.repository;

import com.softlanches.customers.model.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {

    List<Customer> findAllByEmpresaId(UUID empresaId);

    Optional<Customer> findByIdAndEmpresaId(Long id, UUID empresaId);
}
