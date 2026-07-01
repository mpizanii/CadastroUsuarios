package com.scalda.products.repository;

import com.scalda.products.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    List<Product> findAllByEmpresaId(UUID empresaId);

    Page<Product> findAllByEmpresaId(UUID empresaId, Pageable pageable);

    Optional<Product> findByIdAndEmpresaId(Long id, UUID empresaId);

    Optional<Product> findByReceitaIdAndEmpresaId(Long receitaId, UUID empresaId);

    List<Product> findAllByIdInAndEmpresaId(List<Long> ids, UUID empresaId);
}
