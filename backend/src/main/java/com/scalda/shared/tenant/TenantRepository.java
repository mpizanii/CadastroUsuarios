package com.scalda.shared.tenant;

import com.scalda.shared.tenant.model.UsuariosEmpresa;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface TenantRepository extends JpaRepository<UsuariosEmpresa, UUID> {

    @Query("SELECT new com.scalda.shared.tenant.TenantInfo(ue.empresaId, ue.role) FROM UsuariosEmpresa ue WHERE ue.userId = :userId")
    Optional<TenantInfo> findTenantInfoByUserId(@Param("userId") UUID userId);
}
