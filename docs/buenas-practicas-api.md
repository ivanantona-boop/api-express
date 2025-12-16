# Buenas prácticas de programación y cómo funciona la API

## 1. Estructura por capas (Hexagonal)
- **Dominio**: reglas e invariantes (models/VOs) sin dependencias de frameworks.
- **Aplicación**: casos de uso y servicios orquestan el negocio.
- **Infraestructura**: adaptadores concretos (Express, SQLite).
- **Composition root**: cableado en `src/index.ts`.

```ts
// src/index.ts
app.use('/api/productos', productosRouter);
app.use('/api/usuarios', usuariosRouter);
```
El dominio no “sabe” que existe Express; solo se conectan en el composition root.

## 2. Single Responsibility (SRP - Single Responsibility Principle)
Una clase/función debe tener un único motivo de cambio.
```ts
// src/application/use-cases/usuarios/create-user.usecase.ts
export class CreateUserUseCase {
  async execute(data: User) {
    const email = EmailVO.create(data.email); // validación específica
    return await this.repo.create({ ...data, email: email.value });
  }
}
```
Este caso de uso solo se encarga de crear usuarios; la validación HTTP está en los schemas.

## 3. Dependencia de abstracciones (DIP - Dependency Inversion Principle)
Inyecta interfaces, no implementaciones.
```ts
// src/infrastructure/http/controllers/productos.controller.ts
const productService = new ProductService(new ProductRepository());
```
El servicio conoce `IProductRepository`; el controlador decide qué implementación concreta usar.

## 4. Validaciones cerca de la entrada
Valida datos tan pronto llegan, antes del dominio.
```ts
// src/infrastructure/http/schemas/producto.schema.ts
export const ProductoSchema = z.object({
  nombre: z.string().min(3).max(50),
  precio: z.number().positive()
});
```
Si falla, devolvemos 400 y no seguimos al caso de uso.

## 5. Value Objects para invariantes
Encapsula reglas repetidas (IDs válidos, emails normalizados).
```ts
// src/domain/value-objects/id.vo.ts
export class IdVO {
  static create(raw: number) {
    if (!Number.isInteger(raw) || raw <= 0) throw new Error('Id inválido');
    return new IdVO(raw);
  }
}
```
Reutiliza el VO en todos los casos de uso que necesiten IDs.

## 6. Tests aislados y rápidos
Usa dobles de prueba en memoria para no depender de infra real.
```js
// tests/product-service.test.js
class InMemoryProductRepo { /* ... */ }
const service = new ProductService(new InMemoryProductRepo());
```
Así validas la lógica de negocio sin levantar DB ni servidor.

## 7. Controladores delgados
Solo traducen HTTP <-> dominio y manejan códigos de estado.
```ts
// src/infrastructure/http/controllers/usuario.controller.ts
const result = UsuarioSchema.safeParse(req.body);
if (!result.success) { res.status(400).json({ error: result.error.format() }); return; }
const newUser = await userService.createUser(result.data);
res.status(201).json(newUser);
```

## 8. Naming claro y consistente
Rutas en plural, controladores en singular, casos de uso con verbo-acción (`createProduct`, `getAllUsers`).

## 9. Manejo explícito de errores
Propaga errores de negocio y traduce a HTTP adecuado.
```ts
// src/infrastructure/http/controllers/productos.controller.ts
if (error.message.includes('Id inválido')) res.status(400).json({ error: error.message });
```

## 10. API: recorrido de una petición
1. **HTTP entra** por una ruta (`routes/*.ts`).
2. **Controlador** valida y traduce a un caso de uso.
3. **Caso de uso/servicio** aplica reglas y usa puertos (repos).
4. **Repositorio** (infra) ejecuta SQL/DB.
5. **Respuesta HTTP** vuelve al cliente.

```ts
// Ejemplo productos
// routes/productos.routes.ts -> controllers/productos.controller.ts
// -> ProductService -> CreateProductUseCase -> ProductRepository -> SQLite
```

Mantener este flujo claro facilita enseñar APIs y SOLID: cada pieza tiene un rol y depende de contratos, no de detalles.
