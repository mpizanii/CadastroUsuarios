package com.scalda.shared.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI softLanchesOpenAPI() {
        final String schemeName = "bearerAuth";

        return new OpenAPI()
                .info(new Info()
                        .title("Scalda API")
                        .description("""
                                ERP SaaS para empresas do setor alimentício.

                                **Autenticação:** Bearer JWT emitido pelo Supabase Auth (HS256).
                                Todos os endpoints `/api/**` requerem o header `Authorization: Bearer <token>`.

                                **Multi-tenant:** O tenant (empresa) é resolvido automaticamente a partir do JWT.
                                Não é necessário informar `empresa_id` nas requisições.
                                """)
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("Scalda")
                                .email("suporte@scalda.com.br")))
                .addSecurityItem(new SecurityRequirement().addList(schemeName))
                .components(new Components()
                        .addSecuritySchemes(schemeName, new SecurityScheme()
                                .name(schemeName)
                                .type(SecurityScheme.Type.HTTP)
                                .scheme("bearer")
                                .bearerFormat("JWT")
                                .description("Token JWT obtido via Supabase Auth")));
    }
}
