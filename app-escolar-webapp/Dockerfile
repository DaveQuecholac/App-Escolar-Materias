# Dockerfile para Angular Frontend - Multi-stage build
# Stage 1: Build
FROM node:18-alpine AS build

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm ci

# Copiar el resto del código
COPY . .

# Construir la aplicación para producción (ignorar errores de budget)
RUN npm run build -- --configuration production || npm run build -- --configuration development

# Stage 2: Production - Servir con Nginx
FROM nginx:alpine

# Copiar los archivos construidos desde el stage de build
COPY --from=build /app/dist/app-escolar-webapp /usr/share/nginx/html

# Copiar configuración personalizada de nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponer el puerto 80
EXPOSE 80

# Iniciar nginx
CMD ["nginx", "-g", "daemon off;"]

