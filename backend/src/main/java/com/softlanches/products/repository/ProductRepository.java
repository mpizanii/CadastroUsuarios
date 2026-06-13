package com.softlanches.products.repository;

import com.softlanches.products.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    List<Product> findAllByEmpresaId(UUID empresaId);

    Optional<Product> findByIdAndEmpresaId(Long id, UUID empresaId);

    Optional<Product> findByReceitaIdAndEmpresaId(Long receitaId, UUID empresaId);

    List<Product> findAllByIdInAndEmpresaId(List<Long> ids, UUID empresaId);
}
