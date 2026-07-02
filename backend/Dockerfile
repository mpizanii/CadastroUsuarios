# Stage 1 — build
FROM maven:3.9-eclipse-temurin-21-alpine AS builder
WORKDIR /app

# Cache de dependências: copia só o pom.xml primeiro
COPY pom.xml .
RUN mvn dependency:go-offline -q

COPY src ./src
RUN mvn package -DskipTests -q

# Stage 2 — runtime (só JRE, sem JDK)
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

RUN addgroup -S spring && adduser -S spring -G spring

COPY --from=builder /app/target/*.jar app.jar

RUN chown spring:spring app.jar

USER spring

ENTRYPOINT ["java", "-jar", "app.jar"]

HEALTHCHECK --interval=15s --timeout=5s --start-period=30s --retries=5 \
  CMD wget -q --spider http://localhost:8080/actuator/health || exit 1