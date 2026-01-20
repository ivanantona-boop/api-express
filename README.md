API REST - Gestión de Usuarios (Arquitectura Hexagonal)

API robusta desarrollada en Node.js y TypeScript, implementando una Arquitectura Hexagonal (Puertos y Adaptadores) para desacoplar la lógica de negocio de la infraestructura. Utiliza MongoDB como base de datos y valida datos con Zod. 

Stack Tecnológico
Lenguaje: TypeScript 5
Runtime: Node.js (Express 5)
Base de Datos: MongoDB (vía Mongoose)
Validación: Zod
Arquitectura: Hexagonal (Dominio, Aplicación, Infraestructura)
Documentación: Swagger UI (OpenAPI 3.0)
Testing: Jest + Supertest (Integración y E2E)
Seguridad: Helmet, CORS📋 

Requisitos Previos
Antes de empezar, asegúrate de tener instalado:
Node.js (v18 o superior)
MongoDB (Corriendo localmente o una URI de Atlas)

Instalación y Configuración
Clonar el repositorio:
Bash
git clone <url-de-tu-repo>
cd apiejercicio-ts

Instalar dependencias:
Bash
npm install

Configurar Variables de Entorno:Crea un archivo .env en la raíz del proyecto y copia el siguiente contenido:
Fragmento de código
# Servidor
PORT=3005
NODE_ENV=development

# Base de Datos (MongoDB)
# Si usas local:
MONGO_URI=mongodb://127.0.0.1:27017/mi_tienda
# Si usas Atlas:
# MONGO_URI=mongodb+srv://usuario:password@cluster.mongodb.net/mi_tienda

# Seguridad y Configuración
CORS_ORIGIN=*
JWT_SECRET=mi_clave_secreta_temporal
JWT_EXPIRES_IN=1d

Ejecución
Modo Desarrollo
Levanta el servidor con recarga automática (hot-reload):
Bash
npm run dev
La API estará disponible en: http://localhost:3005
Modo Producción
Compila el código TypeScript a JavaScript y ejecútalo:
Bash
npm run build
npm start

Ejecutar Tests
Corre los tests de integración usando un Repositorio Mock (en memoria), sin tocar la base de datos real:
Bash
npm test

Documentación de la API (Swagger)
Una vez arrancado el servidor, puedes explorar y probar todos los endpoints visualmente en: http://localhost:3005/api-docs

Estructura del Proyecto
El código sigue estrictamente la separación de responsabilidades:
src/
├── Dominio/               # Reglas de Negocio (El corazón)
│   ├── models/            # Entidades (Usuario, etc.)
│   └── interfaces/        # Contratos (Repositorios)
│
├── Aplicacion/            # Casos de Uso (Lógica)
│   └── services/          # Orquestación (UsuarioService)
│
├── Infraestructura/       # Adaptadores (Mundo Real)
│   ├── config/            # Configuración (Env, Swagger)
│   ├── controllers/       # Controladores Express
│   ├── database/          # Conexión a MongoDB
│   ├── models/            # Schemas de Mongoose
│   ├── repository/        # Implementación de Repositorios (Mongo, Mock)
│   ├── routes/            # Rutas de la API
│   └── schemas/           # Validaciones Zod
│
├── app.ts                 # Configuración de Express
├── server.ts              # Punto de entrada (Arranque)
└── dependencies.ts        # Inyección de Dependencias
Endpoints Principales
Recurso: Usuarios
Método,Endpoint,Descripción
GET,/api/usuarios,Obtener todos los usuarios
GET,/api/usuarios/:dni,Buscar usuario por DNI
POST,/api/usuarios,Crear nuevo usuario
PUT,/api/usuarios/:dni,Actualizar usuario (parcialmente)
DELETE,/api/usuarios/:dni,Eliminar usuario