package com.scalda.customers.repository;

import com.scalda.customers.model.Customer;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {

    List<Customer> findAllByEmpresaId(UUID empresaId);

    Page<Customer> findAllByEmpresaId(UUID empresaId, Pageable pageable);

    Optional<Customer> findByIdAndEmpresaId(Long id, UUID empresaId);

    List<Customer> findAllByIdInAndEmpresaId(List<Long> ids, UUID empresaId);
}
