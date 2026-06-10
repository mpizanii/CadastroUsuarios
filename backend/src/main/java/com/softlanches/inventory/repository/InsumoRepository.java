package com.softlanches.inventory.repository;

import com.softlanches.inventory.model.Insumo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

// Stub — será expandido quando o módulo Insumos for implementado.
@Repository
public interface InsumoRepository extends JpaRepository<Insumo, Long> {

    List<Insumo> findAllByIdIn(List<Long> ids);
}
