package com.scalda.orders.repository;

import com.scalda.orders.model.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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

    /**
     * P7: paginação de pedidos sem carregar itens (JOIN FETCH + Pageable causaria
     * HibernateJpaDialect.applyQueryHints — paginação em memória). IDs são paginados
     * aqui e depois os itens são buscados via findAllByIdInWithItems.
     */
    Page<Order> findAllByEmpresaId(UUID empresaId, Pageable pageable);

    @Query("SELECT o FROM Order o LEFT JOIN FETCH o.items WHERE o.id IN :ids ORDER BY o.data DESC")
    List<Order> findAllByIdInWithItems(@Param("ids") List<Long> ids);
}
