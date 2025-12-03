# Dockerfile para Django Backend
FROM python:3.12-slim

# Establecer el directorio de trabajo
WORKDIR /app

# Instalar dependencias del sistema necesarias para MySQL y otras librerías
RUN apt-get update && apt-get install -y \
    gcc \
    default-libmysqlclient-dev \
    pkg-config \
    netcat-openbsd \
    && rm -rf /var/lib/apt/lists/*

# Copiar requirements y instalar dependencias de Python
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install gunicorn

# Listar qué hay en el contexto antes de copiar (diagnóstico)
RUN echo "=== DIAGNOSTICO: Listando contexto antes de COPY ===" && ls -la || echo "No se puede listar contexto"

# Copiar todos los archivos de la aplicación
COPY . .

# Listar qué se copió (diagnóstico)
RUN echo "=== DIAGNOSTICO: Después de COPY ===" && \
    echo "Contenido de /app:" && \
    ls -la /app/ && \
    echo "=== Buscando manage.py ===" && \
    find /app -name "manage.py" -type f || echo "manage.py NO ENCONTRADO"

# Copiar y configurar script de entrada
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Crear directorios necesarios
RUN mkdir -p /app/staticfiles /app/media

# Verificar que los archivos críticos existen
RUN test -f /app/manage.py || (echo "ERROR: manage.py no existe en /app/" && ls -la /app/ && exit 1) && \
    test -d /app/app_escolar_api || (echo "ERROR: app_escolar_api no existe" && exit 1) && \
    echo "Verificación exitosa: archivos críticos encontrados"

# Exponer el puerto 8000
EXPOSE 8000

# Usar el script de entrada
ENTRYPOINT ["/entrypoint.sh"]

