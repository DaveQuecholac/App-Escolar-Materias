#!/bin/bash
set -e

echo "Waiting for database to be ready..."
# Esperar a que la base de datos esté lista
until nc -z ${DB_HOST:-db} ${DB_PORT:-3306}; do
  echo "Database is unavailable - sleeping"
  sleep 1
done
echo "Database is ready!"

# Verificar que manage.py existe
if [ ! -f "/app/manage.py" ]; then
    echo "ERROR: manage.py not found in /app/"
    echo "Current directory: $(pwd)"
    echo "Contents of /app/:"
    ls -la /app/ || echo "Cannot list /app/"
    exit 1
fi

# Ejecutar migraciones
echo "Running database migrations..."
python manage.py migrate --noinput

# Recolectar archivos estáticos
echo "Collecting static files..."
python manage.py collectstatic --noinput || echo "Warning: collectstatic failed, continuing..."

# Iniciar Gunicorn
echo "Starting Gunicorn..."
exec gunicorn --bind 0.0.0.0:8000 --workers 3 --timeout 120 --access-logfile - --error-logfile - app_escolar_api.wsgi:application
