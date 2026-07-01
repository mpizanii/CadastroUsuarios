package com.scalda.inventory.repository;

import com.scalda.inventory.model.Insumo;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface InsumoRepository extends JpaRepository<Insumo, Long> {

    List<Insumo> findAllByIdInAndEmpresaId(List<Long> ids, UUID empresaId);

    List<Insumo> findAllByEmpresaId(UUID empresaId);

    Page<Insumo> findAllByEmpresaId(UUID empresaId, Pageable pageable);

    Optional<Insumo> findByIdAndEmpresaId(Long id, UUID empresaId);

    /**
     * P5: retorna apenas insumos cujo status calculado NÃO é "OK",
     * evitando carregar toda a tabela em memória para filtrar depois.
     * Status não-OK quando: abaixo do estoque mínimo (×1.2) OU validade a vencer em ≤ 7 dias.
     */
    @Query("""
            SELECT i FROM Insumo i
            WHERE i.empresaId = :empresaId
              AND (
                (i.estoqueMinimo IS NOT NULL AND i.quantidade <= i.estoqueMinimo * 1.2)
                OR (i.validade IS NOT NULL AND i.validade <= :limiteValidade)
              )
            ORDER BY i.nome
            """)
    List<Insumo> findAlertasByEmpresaId(
            @Param("empresaId") UUID empresaId,
            @Param("limiteValidade") LocalDate limiteValidade);
}
