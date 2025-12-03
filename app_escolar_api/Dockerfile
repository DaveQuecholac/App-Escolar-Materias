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

# Copiar requirements desde app_escolar_api y instalar dependencias
COPY app_escolar_api/requirements.txt ./requirements.txt
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install gunicorn

# Copiar manage.py
COPY app_escolar_api/manage.py ./manage.py

# Copiar el directorio completo de la aplicación Django
COPY app_escolar_api/app_escolar_api/ ./app_escolar_api/

# Copiar script de entrada
COPY app_escolar_api/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Crear directorios necesarios
RUN mkdir -p /app/staticfiles /app/media

# Verificar que los archivos críticos existen
RUN test -f /app/manage.py && \
    test -d /app/app_escolar_api && \
    test -f /app/app_escolar_api/settings.py && \
    echo "Verificación exitosa: archivos críticos encontrados" || \
    (echo "ERROR: Archivos críticos no encontrados" && ls -la /app/ && exit 1)

# Exponer el puerto 8000
EXPOSE 8000

# Usar el script de entrada
ENTRYPOINT ["/entrypoint.sh"]

