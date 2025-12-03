# Guía de Docker para App Escolar

Esta guía explica cómo usar Docker para ejecutar el backend (Django) y frontend (Angular) de la aplicación.

## Requisitos Previos

- Docker instalado
- Docker Compose instalado

## Estructura de Archivos

```
.
├── docker-compose.yml          # Orquestación de servicios
├── app_escolar_api/
│   ├── Dockerfile              # Imagen del backend Django
│   └── .dockerignore
└── app-escolar-webapp/
    ├── Dockerfile              # Imagen del frontend Angular
    ├── nginx.conf              # Configuración de Nginx
    └── .dockerignore
```

## Servicios

El `docker-compose.yml` incluye tres servicios:

1. **db**: Base de datos MySQL 8.0
   - Puerto: 3307
   - Base de datos: `app_escolar_db`
   - Usuario: `app_user`
   - Contraseña: `app_password` (cambiar en producción)

2. **backend**: API Django
   - Puerto: 8000
   - URL: http://localhost:8000

3. **frontend**: Aplicación Angular servida con Nginx
   - Puerto: 4200
   - URL: http://localhost:4200

## Comandos Principales

### Construir y levantar los contenedores

```bash
docker-compose up --build
```

### Levantar en segundo plano

```bash
docker-compose up -d --build
```

### Ver logs

```bash
# Todos los servicios
docker-compose logs -f

# Servicio específico
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f db
```

### Detener los contenedores

```bash
docker-compose down
```

### Detener y eliminar volúmenes (incluyendo datos de la BD)

```bash
docker-compose down -v
```

### Reconstruir un servicio específico

```bash
docker-compose build backend
docker-compose up -d backend
```

## Acceso a los Servicios

- **Frontend**: http://localhost:4200
- **Backend API**: http://localhost:8000
- **Base de datos**: localhost:3307

## Variables de Entorno

El backend está configurado para usar variables de entorno cuando está en Docker:

- `DB_HOST`: Host de la base de datos (default: db)
- `DB_PORT`: Puerto de la base de datos (default: 3306)
- `DB_NAME`: Nombre de la base de datos (default: app_escolar_db)
- `DB_USER`: Usuario de la base de datos (default: app_user)
- `DB_PASSWORD`: Contraseña de la base de datos (default: app_password)
- `DEBUG`: Modo debug (default: True)
- `ALLOWED_HOSTS`: Hosts permitidos (separados por comas)
- `CORS_ALLOWED_ORIGINS`: Orígenes permitidos para CORS (separados por comas)

## Migraciones de Base de Datos

Las migraciones se ejecutan automáticamente al iniciar el contenedor del backend. Si necesitas ejecutarlas manualmente:

```bash
docker-compose exec backend python manage.py migrate
```

## Crear un Superusuario

```bash
docker-compose exec backend python manage.py createsuperuser
```

## Acceder al Shell de Django

```bash
docker-compose exec backend python manage.py shell
```

## Acceder a la Base de Datos

```bash
docker-compose exec db mysql -u app_user -papp_password app_escolar_db
```

## Solución de Problemas

### El backend no se conecta a la base de datos

Asegúrate de que el servicio `db` esté saludable antes de que el backend intente conectarse. El `docker-compose.yml` incluye un healthcheck para esto.

### Error de permisos en archivos estáticos

Los archivos estáticos se recopilan automáticamente al iniciar el contenedor. Si hay problemas:

```bash
docker-compose exec backend python manage.py collectstatic --noinput
```

### El frontend no se conecta al backend

Verifica que la URL del backend en el frontend apunte a `http://localhost:8000` o usa el nombre del servicio Docker `http://backend:8000` si están en la misma red.

### Reconstruir todo desde cero

```bash
docker-compose down -v
docker-compose build --no-cache
docker-compose up -d
```

## Producción

Para producción, considera:

1. Cambiar las contraseñas en `docker-compose.yml`
2. Configurar `DEBUG=False` en las variables de entorno
3. Usar un archivo `.env` para las variables sensibles
4. Configurar HTTPS con un proxy reverso (nginx/traefik)
5. Usar volúmenes persistentes para la base de datos
6. Configurar backups automáticos de la base de datos

