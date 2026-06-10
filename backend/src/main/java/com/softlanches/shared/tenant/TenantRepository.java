package com.softlanches.shared.tenant;

import com.softlanches.shared.tenant.model.UsuariosEmpresa;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface TenantRepository extends JpaRepository<UsuariosEmpresa, UUID> {

    @Query("SELECT ue.empresaId FROM UsuariosEmpresa ue WHERE ue.userId = :userId")
    Optional<UUID> findEmpresaIdByUserId(@Param("userId") UUID userId);
}
