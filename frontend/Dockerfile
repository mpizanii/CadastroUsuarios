# Stage 1 — build
FROM node:22-alpine AS builder
WORKDIR /app

# Cache de dependências: copia lockfiles antes do restante do source
COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Variáveis VITE_* são injetadas em build-time (não existem em runtime)
ARG VITE_API_URL
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY

RUN npm run build

# Stage 2 — runtime (nginx servindo arquivos estáticos)
FROM nginx:1.27-alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
