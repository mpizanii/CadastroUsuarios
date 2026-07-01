package com.scalda.shared.tenant;

import com.scalda.shared.exception.TenantAccessDeniedException;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
@RequiredArgsConstructor
public class TenantResolver {

    private final TenantRepository tenantRepository;

    /**
     * P6: resultado cacheado por 5 minutos (configurado em CacheConfig).
     * Evita query userId→empresaId/role em toda requisição autenticada.
     */
    @Cacheable(value = "tenant-empresa", key = "#userId")
    public TenantInfo resolveTenantInfo(String userId) {
        return tenantRepository.findTenantInfoByUserId(UUID.fromString(userId))
                .orElseThrow(() -> new TenantAccessDeniedException(
                        "Usuário " + userId + " não está associado a nenhuma empresa"
                ));
    }

    /** Convenience overload — resolves only empresaId (uses same cache entry). */
    public UUID resolveEmpresaId(String userId) {
        return resolveTenantInfo(userId).empresaId();
    }
}
