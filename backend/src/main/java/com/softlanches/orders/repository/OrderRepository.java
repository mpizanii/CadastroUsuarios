package com.softlanches.orders.repository;

import com.softlanches.orders.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    @Query("SELECT o FROM Order o LEFT JOIN FETCH o.items WHERE o.empresaId = :empresaId ORDER BY o.data DESC")
    List<Order> findAllByEmpresaIdWithItems(@Param("empresaId") UUID empresaId);

    @Query("SELECT o FROM Order o LEFT JOIN FETCH o.items WHERE o.id = :id AND o.empresaId = :empresaId")
    Optional<Order> findByIdAndEmpresaIdWithItems(@Param("id") Long id, @Param("empresaId") UUID empresaId);
}
