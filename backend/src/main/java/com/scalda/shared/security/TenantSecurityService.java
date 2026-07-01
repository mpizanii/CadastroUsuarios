package com.scalda.shared.security;

import com.scalda.shared.tenant.TenantContext;
import org.springframework.stereotype.Service;

/**
 * Bean used in @PreAuthorize SpEL expressions to enforce role-based access.
 * Roles come from usuarios_empresa.role column, set in TenantContext by TenantFilter.
 *
 * Known roles: "admin" (full access), "visualizador" (read-only).
 */
@Service("tenantSecurity")
public class TenantSecurityService {

    public boolean isAdmin() {
        String role = TenantContext.getRole();
        return role != null && !"visualizador".equalsIgnoreCase(role);
    }
}
