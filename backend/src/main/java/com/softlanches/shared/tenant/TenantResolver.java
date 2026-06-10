package com.softlanches.shared.tenant;

import com.softlanches.shared.exception.TenantAccessDeniedException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
@RequiredArgsConstructor
public class TenantResolver {

    private final TenantRepository tenantRepository;

    public UUID resolveEmpresaId(String userId) {
        return tenantRepository.findEmpresaIdByUserId(UUID.fromString(userId))
                .orElseThrow(() -> new TenantAccessDeniedException(
                        "Usuário " + userId + " não está associado a nenhuma empresa"
                ));
    }
}
