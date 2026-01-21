# 🚀 API REST - Gestión de Usuarios (Arquitectura Hexagonal)

![CI Status](https://github.com/TU_USUARIO/TU_REPO/actions/workflows/ci.yml/badge.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Node.js](https://img.shields.io/badge/Node.js-18%2B-green)
![License](https://img.shields.io/badge/License-MIT-yellow)

API robusta desarrollada en **Node.js** y **TypeScript**, implementando una **Arquitectura Hexagonal** (Puertos y Adaptadores) para desacoplar la lógica de negocio de la infraestructura. Utiliza **MongoDB** como base de datos, valida datos con **Zod** y asegura la calidad del código mediante automatización.

## 🛠️ Stack Tecnológico

- **Lenguaje:** TypeScript 5
- **Runtime:** Node.js (Express 5)
- **Base de Datos:** MongoDB (vía Mongoose)
- **Validación:** Zod
- **Arquitectura:** Hexagonal (Dominio, Aplicación, Infraestructura)
- **Documentación:** Swagger UI (OpenAPI 3.0)
- **Testing:** Jest + Supertest (Integración y E2E)
- **Calidad y Estilo:** ESLint, Prettier, Husky
- **CI/CD:** GitHub Actions
- **Seguridad:** Helmet, CORS

## 📋 Requisitos Previos

Antes de empezar, asegúrate de tener instalado:
- [Node.js](https://nodejs.org/) (v18 o superior)
- [MongoDB](https://www.mongodb.com/) (Corriendo localmente o una URI de Atlas)

## 🚀 Instalación y Configuración

1. **Clonar el repositorio:**
   ```bash
   git clone <url-de-tu-repo>
   cd apiejercicio-ts
Instalar dependencias:

Bash

npm install
Esto instalará también los hooks de Husky automáticamente.

Configurar Variables de Entorno: Crea un archivo .env en la raíz del proyecto y copia el siguiente contenido:

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
▶️ Ejecución
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
🧪 Ejecutar Tests
Corre los tests de integración usando un Repositorio Mock (en memoria), sin tocar la base de datos real:

Bash

npm test
✨ Calidad de Código y Automatización
Este proyecto utiliza herramientas profesionales para asegurar la calidad y consistencia del código:

ESLint: Análisis estático para detectar errores y malas prácticas.

Prettier: Formateador automático de código.

Husky & Lint-staged: Git Hooks que impiden subir código roto.

Comandos útiles
Bash

# Formatear todo el código automáticamente (Prettier)
npm run format

# Buscar errores de código y estilo (ESLint)
npm run lint
🛡️ Git Hooks (Husky)
Al intentar hacer un git commit, el sistema ejecutará automáticamente las validaciones. Si tu código tiene errores de sintaxis o no pasa el linter, el commit fallará. Esto protege la rama principal de código defectuoso.

🚀 Integración Continua (CI/CD)
El proyecto cuenta con un pipeline automatizado en GitHub Actions.

Cada vez que se realiza un push o un pull request a la rama principal (main o master), un servidor remoto ejecuta los siguientes pasos:

Instala dependencias (npm ci).

Verifica el estilo de código (Linting).

Compila el proyecto (npm run build).

Ejecuta los tests de integración (npm test) usando el Mock Repository.

📚 Documentación de la API (Swagger)
Una vez arrancado el servidor, puedes explorar y probar todos los endpoints visualmente en:

👉 http://localhost:3005/api-docs

🏗️ Estructura del Proyecto
El código sigue estrictamente la separación de responsabilidades:

src/
├── Dominio/               # 🧠 Reglas de Negocio (El corazón)
│   ├── models/            # Entidades (Usuario, etc.)
│   └── interfaces/        # Contratos (Repositorios)
│
├── Aplicacion/            # ⚙️ Casos de Uso (Lógica)
│   └── services/          # Orquestación (UsuarioService)
│
├── Infraestructura/       # 🔌 Adaptadores (Mundo Real)
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
🔌 Endpoints Principales
Recurso: Usuarios

Método	Endpoint	Descripción
GET	/api/usuarios	Obtener todos los usuarios
GET	/api/usuarios/:dni	Buscar usuario por DNI
POST	/api/usuarios	Crear nuevo usuario
PUT	/api/usuarios/:dni	Actualizar usuario (parcialmente)
DELETE	/api/usuarios/:dni	Eliminar usuario