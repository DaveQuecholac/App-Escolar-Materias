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

# Copiar el script de entrada
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Copiar el código de la aplicación
COPY . .

# Verificar que manage.py se copió correctamente
RUN ls -la /app/manage.py || (echo "ERROR: manage.py not found after COPY" && exit 1)

# Crear directorios necesarios
RUN mkdir -p /app/staticfiles /app/media

# Exponer el puerto 8000
EXPOSE 8000

# Usar el script de entrada
ENTRYPOINT ["/entrypoint.sh"]

