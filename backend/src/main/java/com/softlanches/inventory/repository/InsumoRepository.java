package com.softlanches.inventory.repository;

import com.softlanches.inventory.model.Insumo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface InsumoRepository extends JpaRepository<Insumo, Long> {

    List<Insumo> findAllByIdInAndEmpresaId(List<Long> ids, UUID empresaId);

    List<Insumo> findAllByEmpresaId(UUID empresaId);

    Optional<Insumo> findByIdAndEmpresaId(Long id, UUID empresaId);
}
