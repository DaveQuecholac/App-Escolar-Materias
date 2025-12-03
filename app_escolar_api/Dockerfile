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
    dos2unix \
    && rm -rf /var/lib/apt/lists/*

# Copiar requirements.txt e instalar dependencias Python
COPY requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt && \
    pip install --no-cache-dir gunicorn

# Copiar el entrypoint.sh a una ubicación que NO será sobrescrita por el volumen
COPY entrypoint.sh /entrypoint.sh
RUN dos2unix /entrypoint.sh 2>/dev/null || true && \
    chmod +x /entrypoint.sh

# Copiar el resto del código de la aplicación
COPY . /app/

# Verificar que entrypoint.sh existe y es ejecutable
RUN test -f /entrypoint.sh && \
    test -x /entrypoint.sh && \
    echo "Entrypoint verified successfully" || \
    (echo "ERROR: entrypoint.sh not found or not executable!" && \
     ls -la / | grep entrypoint && \
     exit 1)

# Crear directorios necesarios
RUN mkdir -p /app/staticfiles /app/media

# Exponer el puerto 8000
EXPOSE 8000

# Usar el script de entrada desde la raíz (no será sobrescrito por el volumen)
ENTRYPOINT ["/entrypoint.sh"]
