# Sistema de Gestión Escolar

Sistema completo de gestión escolar desarrollado con arquitectura de microservicios, compuesto por una API REST desarrollada en Django y una aplicación web frontend desarrollada en Angular. El sistema permite la administración de usuarios (administradores, maestros y alumnos) y materias, con un sistema de autenticación basado en tokens y control de acceso por roles.

## Tabla de Contenidos

- [Descripción General](#descripción-general)
- [Arquitectura del Sistema](#arquitectura-del-sistema)
- [Tecnologías Utilizadas](#tecnologías-utilizadas)
- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Instalación Local](#instalación-local)
- [Instalación con Docker](#instalación-con-docker)
- [Configuración](#configuración)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Funcionalidades](#funcionalidades)
- [API REST](#api-rest)
- [Uso](#uso)
- [Despliegue](#despliegue)
- [Contribución](#contribución)

## Descripción General

Este proyecto es un sistema integral de gestión escolar que proporciona las herramientas necesarias para administrar una institución educativa. El sistema permite gestionar diferentes tipos de usuarios (administradores, maestros y alumnos), materias académicas, y proporciona visualizaciones estadísticas mediante gráficas.

### Características Principales

- Gestión completa de usuarios con tres tipos de roles: Administrador, Maestro y Alumno
- Sistema de autenticación seguro basado en tokens Bearer
- Control de acceso granular según roles de usuario
- Gestión de materias académicas con asignación de profesores
- Visualización de estadísticas mediante gráficas
- Interfaz de usuario moderna y responsive
- API RESTful completamente documentada
- Arquitectura containerizada con Docker

## Arquitectura del Sistema

El sistema está dividido en tres componentes principales:

1. **Backend (API REST)**: Desarrollado con Django y Django REST Framework, proporciona todos los endpoints necesarios para la gestión de datos.
2. **Frontend (Aplicación Web)**: Desarrollado con Angular, proporciona la interfaz de usuario para interactuar con el sistema.
3. **Base de Datos**: MySQL 8.0 almacena toda la información del sistema.

### Diagrama de Arquitectura

```
┌─────────────────┐
│   Frontend      │
│   (Angular)     │
│   Puerto: 4200  │
└────────┬────────┘
         │ HTTP/HTTPS
         │
┌────────▼────────┐
│   Backend       │
│   (Django)      │
│   Puerto: 8000  │
└────────┬────────┘
         │
┌────────▼────────┐
│   Base de       │
│   Datos (MySQL) │
│   Puerto: 3307  │
└─────────────────┘
```

## Tecnologías Utilizadas

### Backend

- **Python 3.12**: Lenguaje de programación
- **Django 5.0.2**: Framework web de alto nivel
- **Django REST Framework 3.16.1**: Framework para construcción de APIs REST
- **PyMySQL**: Conector para MySQL
- **Django CORS Headers 4.7.0**: Manejo de CORS para comunicación con frontend
- **Django Filter**: Sistema de filtrado avanzado
- **Gunicorn**: Servidor WSGI para producción
- **Cryptography 42.0.8**: Utilidades de cifrado
- **Pillow 10.4.0**: Procesamiento de imágenes
- **Google Cloud Storage 2.15.0**: Almacenamiento en la nube (opcional)

### Frontend

- **Angular 16.2**: Framework de aplicaciones web
- **Angular Material 16.2.14**: Componentes UI de Material Design
- **Bootstrap 5.3.8**: Framework CSS responsive
- **Bootstrap Icons 1.13.1**: Iconografía
- **Chart.js / ng2-charts 4.1.1**: Gráficas y visualización de datos
- **RxJS 7.8.0**: Programación reactiva
- **TypeScript 5.1.3**: Lenguaje de programación tipado
- **ngx-cookie-service 16.1.0**: Manejo de cookies
- **ngx-mask 16.4.2**: Máscaras de entrada
- **ngx-material-timepicker 13.1.1**: Selector de tiempo

### Base de Datos

- **MySQL 8.0**: Sistema de gestión de bases de datos relacional

### DevOps y Contenedores

- **Docker**: Containerización de aplicaciones
- **Docker Compose**: Orquestación de contenedores
- **Nginx**: Servidor web para servir el frontend en producción

## Requisitos Previos

### Para Instalación Local

- Python 3.12 o superior
- Node.js 18 o superior
- npm 9 o superior
- MySQL 8.0 o superior
- Git

### Para Instalación con Docker

- Docker 20.10 o superior
- Docker Compose 2.0 o superior

## Instalación

### Instalación Local

#### 1. Clonar el Repositorio

```bash
git clone <url-del-repositorio>
cd WEB
```

#### 2. Configurar el Backend

```bash
cd app_escolar_api

# Crear entorno virtual
python -m venv venv

# Activar entorno virtual
# En Windows:
venv\Scripts\activate
# En Linux/Mac:
source venv/bin/activate

# Instalar dependencias
pip install -r requirements.txt
pip install gunicorn
```

#### 3. Configurar la Base de Datos

Crear un archivo `my.cnf` en el directorio `app_escolar_api/` con la siguiente configuración:

```ini
[client]
database = app_escolar_db
user = tu_usuario
password = tu_contraseña
host = 127.0.0.1
port = 3307
default-character-set = utf8mb4
```

Crear la base de datos en MySQL:

```sql
CREATE DATABASE app_escolar_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

#### 4. Ejecutar Migraciones

```bash
python manage.py migrate
```

#### 5. Crear Superusuario (Opcional)

```bash
python manage.py createsuperuser
```

#### 6. Configurar el Frontend

```bash
cd ../app-escolar-webapp

# Instalar dependencias
npm install
```

#### 7. Configurar Variables de Entorno del Frontend

Editar `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  url_api: "http://127.0.0.1:8000"
};
```

#### 8. Iniciar los Servicios

**Terminal 1 - Backend:**

```bash
cd app_escolar_api
python manage.py runserver
```

**Terminal 2 - Frontend:**

```bash
cd app-escolar-webapp
npm start
```

El backend estará disponible en `http://localhost:8000` y el frontend en `http://localhost:4200`.

### Instalación con Docker

#### 1. Clonar el Repositorio

```bash
git clone <url-del-repositorio>
cd WEB
```

#### 2. Construir y Levantar los Contenedores

```bash
docker-compose up --build
```

Para ejecutar en segundo plano:

```bash
docker-compose up -d --build
```

#### 3. Verificar los Servicios

- Frontend: http://localhost:4200
- Backend API: http://localhost:8000
- Base de datos: localhost:3307

#### 4. Ejecutar Migraciones (Primera Vez)

```bash
docker-compose exec backend python manage.py migrate
```

#### 5. Crear Superusuario (Opcional)

```bash
docker-compose exec backend python manage.py createsuperuser
```

Para más información sobre Docker, consultar el archivo `DOCKER_README.md`.

## Configuración

### Variables de Entorno del Backend

El backend soporta las siguientes variables de entorno:

- `DEBUG`: Modo debug (default: True)
- `ALLOWED_HOSTS`: Hosts permitidos separados por comas (default: localhost,127.0.0.1)
- `DB_HOST`: Host de la base de datos (default: 127.0.0.1)
- `DB_PORT`: Puerto de la base de datos (default: 3307)
- `DB_NAME`: Nombre de la base de datos (default: app_escolar_db)
- `DB_USER`: Usuario de la base de datos (default: root)
- `DB_PASSWORD`: Contraseña de la base de datos
- `CORS_ALLOWED_ORIGINS`: Orígenes permitidos para CORS separados por comas (default: http://localhost:4200,http://localhost:80)

### Configuración de CORS

El backend está configurado para permitir peticiones desde el frontend. Los orígenes permitidos se configuran mediante la variable de entorno `CORS_ALLOWED_ORIGINS`.

## Estructura del Proyecto

```
WEB/
├── app_escolar_api/              # Backend Django
│   ├── app_escolar_api/          # Configuración del proyecto
│   │   ├── settings.py           # Configuración de Django
│   │   ├── urls.py               # URLs principales
│   │   ├── wsgi.py               # WSGI config
│   │   ├── models.py             # Modelos de datos
│   │   ├── serializers.py        # Serializadores DRF
│   │   ├── views/                # Vistas de la API
│   │   │   ├── auth.py           # Autenticación
│   │   │   ├── users.py          # Gestión de usuarios
│   │   │   ├── alumnos.py        # Gestión de alumnos
│   │   │   ├── maestros.py       # Gestión de maestros
│   │   │   └── materias.py       # Gestión de materias
│   │   └── migrations/           # Migraciones de BD
│   ├── manage.py                 # Script de gestión Django
│   ├── requirements.txt          # Dependencias Python
│   ├── Dockerfile                # Dockerfile del backend
│   └── my.cnf                    # Configuración MySQL
│
├── app-escolar-webapp/           # Frontend Angular
│   ├── src/
│   │   ├── app/
│   │   │   ├── screens/          # Pantallas principales
│   │   │   │   ├── login-screen/
│   │   │   │   ├── home-screen/
│   │   │   │   ├── admin-screen/
│   │   │   │   ├── alumnos-screen/
│   │   │   │   ├── maestros-screen/
│   │   │   │   ├── materias-screen/
│   │   │   │   └── graficas-screen/
│   │   │   ├── services/         # Servicios HTTP
│   │   │   ├── layouts/          # Layouts de la aplicación
│   │   │   ├── partials/         # Componentes parciales
│   │   │   └── modals/           # Modales
│   │   ├── assets/               # Archivos estáticos
│   │   └── environments/         # Variables de entorno
│   ├── package.json              # Dependencias Node.js
│   ├── Dockerfile                # Dockerfile del frontend
│   └── nginx.conf                # Configuración Nginx
│
├── docker-compose.yml            # Orquestación Docker
├── DOCKER_README.md              # Documentación Docker
└── README.md                     # Este archivo
```

## Funcionalidades

### Gestión de Usuarios

El sistema maneja tres tipos de usuarios con diferentes permisos:

#### Administrador

- Crear y gestionar administradores
- Crear y gestionar maestros
- Crear y gestionar alumnos
- Gestión completa de materias
- Visualización de estadísticas y gráficas
- Acceso a todas las funcionalidades del sistema

#### Maestro

- Ver su perfil y datos personales
- Ver alumnos asignados (si aplica)
- Ver materias asignadas
- Gestión de materias asignadas
- Visualización de gráficas relacionadas

#### Alumno

- Ver su perfil y datos personales
- Ver materias disponibles
- Visualización de gráficas relacionadas

### Gestión de Materias

- Crear, editar y eliminar materias
- Asignar profesores a materias
- Definir horarios, días de la semana, salones
- Gestionar NRC (Número de Registro de Clase)
- Definir créditos y programa educativo

### Sistema de Autenticación

- Autenticación basada en tokens Bearer
- Login seguro con validación de credenciales
- Logout con invalidación de tokens
- Control de acceso basado en roles

### Visualización de Datos

- Gráficas estadísticas de usuarios
- Gráficas de materias
- Dashboard con información resumida

## API REST

### Endpoints de Autenticación

#### POST /login/
Iniciar sesión y obtener token de autenticación.

**Request Body:**
```json
{
  "username": "usuario",
  "password": "contraseña"
}
```

**Response:**
```json
{
  "id": 1,
  "token": "token_bearer_aqui",
  "rol": "administrador"
}
```

#### GET /logout/
Cerrar sesión e invalidar token. Requiere autenticación.

**Headers:**
```
Authorization: Bearer token_aqui
```

### Endpoints de Usuarios

#### POST /admin/
Crear un nuevo administrador.

#### GET /lista-admins/
Listar todos los administradores.

#### POST /alumnos/
Crear un nuevo alumno.

#### GET /lista-alumnos/
Listar todos los alumnos.

#### POST /maestros/
Crear un nuevo maestro.

#### GET /lista-maestros/
Listar todos los maestros.

#### GET /total-usuarios/
Obtener el total de usuarios en el sistema.

### Endpoints de Materias

#### POST /materias/
Crear una nueva materia.

**Request Body:**
```json
{
  "nrc": "12345",
  "nombre_materia": "Matemáticas I",
  "seccion": "A",
  "dias_semana": "[\"Lunes\", \"Miércoles\"]",
  "hora_inicio": "08:00:00",
  "hora_fin": "10:00:00",
  "salon": "A-101",
  "programa_educativo": "Ingeniería",
  "profesor_asignado": 1,
  "creditos": 5
}
```

#### GET /lista-materias/
Listar todas las materias.

#### GET /total-materias/
Obtener el total de materias en el sistema.

### Paginación

Todos los endpoints de listado soportan paginación con los siguientes parámetros:

- `page`: Número de página (default: 1)
- `page_size`: Tamaño de página (default: 10, máximo: 100)

### Autenticación

La mayoría de los endpoints requieren autenticación mediante token Bearer:

```
Authorization: Bearer tu_token_aqui
```

## Uso

### Primer Uso

1. Iniciar el sistema (local o con Docker)
2. Acceder a http://localhost:4200
3. Crear un usuario administrador desde el registro
4. Iniciar sesión con las credenciales creadas
5. Comenzar a gestionar usuarios y materias

### Flujo de Trabajo Típico

1. **Administrador crea usuarios**: Administradores, Maestros y Alumnos
2. **Administrador crea materias**: Define materias con sus características
3. **Asignación de profesores**: Asigna maestros a las materias
4. **Visualización**: Los usuarios pueden ver información según su rol

## Despliegue

### Despliegue en Producción

Para desplegar en producción, se recomienda:

1. Configurar variables de entorno de producción
2. Establecer `DEBUG=False` en el backend
3. Configurar HTTPS con un proxy reverso (Nginx/Traefik)
4. Usar variables de entorno seguras para contraseñas y secretos
5. Configurar backups automáticos de la base de datos
6. Implementar monitoreo y logs

### Variables de Entorno de Producción

Crear un archivo `.env` o configurar variables de entorno del sistema:

```bash
DEBUG=False
ALLOWED_HOSTS=tu-dominio.com,www.tu-dominio.com
DB_HOST=tu-host-db
DB_PORT=3306
DB_NAME=app_escolar_db
DB_USER=usuario_seguro
DB_PASSWORD=contraseña_segura
CORS_ALLOWED_ORIGINS=https://tu-dominio.com
SECRET_KEY=tu-secret-key-muy-segura
```

### Despliegue con Docker en Producción

Modificar `docker-compose.yml` con configuraciones de producción:

- Cambiar contraseñas predeterminadas
- Configurar volúmenes persistentes
- Añadir configuración de red segura
- Implementar health checks

## Modelos de Datos

### Administradores

- id: Identificador único
- user: Relación con modelo User de Django
- clave_admin: Clave de administrador
- telefono: Número de teléfono
- rfc: RFC del administrador
- edad: Edad
- ocupacion: Ocupación
- creation: Fecha de creación
- update: Fecha de actualización

### Alumnos

- id: Identificador único
- user: Relación con modelo User de Django
- matricula: Matrícula del alumno
- curp: CURP del alumno
- rfc: RFC del alumno
- fecha_nacimiento: Fecha de nacimiento
- edad: Edad
- telefono: Número de teléfono
- ocupacion: Ocupación
- creation: Fecha de creación
- update: Fecha de actualización

### Maestros

- id: Identificador único
- user: Relación con modelo User de Django
- id_trabajador: ID de trabajador
- fecha_nacimiento: Fecha de nacimiento
- telefono: Número de teléfono
- rfc: RFC del maestro
- cubiculo: Número de cubículo
- edad: Edad
- area_investigacion: Área de investigación
- materias_json: JSON con materias asignadas
- creation: Fecha de creación
- update: Fecha de actualización

### Materias

- id: Identificador único
- nrc: Número de Registro de Clase (único)
- nombre_materia: Nombre de la materia
- seccion: Sección
- dias_semana: Días de la semana (JSON string)
- hora_inicio: Hora de inicio
- hora_fin: Hora de fin
- salon: Salón asignado
- programa_educativo: Programa educativo
- profesor_asignado: Relación con modelo Maestros
- creditos: Número de créditos
- creation: Fecha de creación
- update: Fecha de actualización

## Solución de Problemas

### El backend no se conecta a la base de datos

- Verificar que MySQL esté ejecutándose
- Revisar las credenciales en `my.cnf` o variables de entorno
- Verificar que la base de datos exista
- Comprobar que el puerto sea correcto

### Error de CORS

- Verificar que `CORS_ALLOWED_ORIGINS` incluya la URL del frontend
- Asegurar que `CORS_ALLOW_CREDENTIALS=True` esté configurado

### Error en migraciones

```bash
# Eliminar migraciones y recrearlas
python manage.py makemigrations
python manage.py migrate
```

### Problemas con Docker

```bash
# Reconstruir desde cero
docker-compose down -v
docker-compose build --no-cache
docker-compose up -d
```

## Contribución

Para contribuir al proyecto:

1. Fork el repositorio
2. Crear una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -am 'Añadir nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crear un Pull Request

## Licencia

Este proyecto es privado y de uso interno.

## Contacto

Para más información o soporte, contactar al equipo de desarrollo.

