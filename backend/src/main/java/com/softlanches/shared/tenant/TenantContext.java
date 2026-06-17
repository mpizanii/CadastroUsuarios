package com.softlanches.shared.tenant;

import com.softlanches.shared.exception.TenantAccessDeniedException;

import java.util.UUID;

public final class TenantContext {

    private static final ThreadLocal<UUID> TENANT_ID = new ThreadLocal<>();
    private static final ThreadLocal<String> TENANT_ROLE = new ThreadLocal<>();

    private TenantContext() {}

    public static void set(UUID empresaId, String role) {
        TENANT_ID.set(empresaId);
        TENANT_ROLE.set(role);
    }

    public static void setEmpresaId(UUID empresaId) {
        TENANT_ID.set(empresaId);
    }

    public static UUID getEmpresaId() {
        return TENANT_ID.get();
    }

    public static UUID getRequiredEmpresaId() {
        UUID id = TENANT_ID.get();
        if (id == null) {
            throw new TenantAccessDeniedException("Contexto de tenant não inicializado");
        }
        return id;
    }

    public static String getRole() {
        return TENANT_ROLE.get();
    }

    public static boolean hasRole(String role) {
        return role != null && role.equalsIgnoreCase(TENANT_ROLE.get());
    }

    public static void clear() {
        TENANT_ID.remove();
        TENANT_ROLE.remove();
    }
}
