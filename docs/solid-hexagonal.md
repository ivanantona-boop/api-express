## Guía rápida: SOLID aplicado aquí

### S (Single Responsibility Principle)
Una clase/módulo debe tener un único motivo de cambio.
```ts
// src/application/use-cases/usuarios/create-user.usecase.ts
export class CreateUserUseCase {
  async execute(data: User) {
    const email = EmailVO.create(data.email); // solo regla de creación
    return await this.repo.create({ ...data, email: email.value });
  }
}
```
Cada caso de uso atiende un flujo. El controlador solo traduce HTTP, el repositorio solo habla con la BD.

### O (Open/Closed Principle)
Abierto a extensión, cerrado a modificación.
```ts
// src/application/services/producto.service.ts
this.createProductUC = new CreateProductUseCase(this.productRepo);
```
Para agregar reglas nuevas, extiendes el caso de uso sin tocar controladores/rutas ya probados.

### L (Liskov Substitution Principle)
Las implementaciones deben poder sustituir a la abstracción sin romper código.
```ts
// src/domain/repositories/product-repository.interface.ts
export interface IProductRepository { /* ... */ }

// src/infrastructure/repository/producto.repository.ts
export class ProductRepository implements IProductRepository { /* ... */ }
```
Cualquier repo (SQLite, memoria, API) puede inyectarse al servicio sin cambiar su comportamiento observable.

### I (Interface Segregation Principle)
Mejor muchas interfaces pequeñas que una gigante.
```ts
// src/domain/repositories/user-repository.interface.ts
export interface IUserRepository {
  getAll(): Promise<User[]>;
  create(user: User): Promise<User>;
}
```
Los casos de uso de usuarios solo dependen de lo que necesitan (listar/crear), no de métodos que no usan.

### D (Dependency Inversion Principle)
Depende de abstracciones, no de concreciones.
```ts
// src/application/services/usuario.service.ts
constructor(repo: IUserRepository) { this.userRepo = repo; }

// src/infrastructure/http/controllers/usuario.controller.ts
const userService = new UserService(new UserRepository());
```
El servicio conoce la interfaz, el controlador inyecta la implementación concreta.

---

## Arquitectura Hexagonal en el proyecto

- **Dominio**: modelos y value objects (`src/domain/**`). No conocen frameworks.
- **Aplicación**: casos de uso y servicios (`src/application/**`). Orquestan reglas de negocio apoyándose en puertos.
- **Infraestructura**: adaptadores concretos (`src/infrastructure/**`): HTTP (Express), repositorios SQLite, base de datos.
- **Composition Root**: `src/index.ts` cablea adaptadores con la aplicación.

```ts
// src/infrastructure/http/controllers/productos.controller.ts
const productService = new ProductService(new ProductRepository()); // puerto + adaptador

export const createProducto = async (req, res) => {
  const result = ProductoSchema.safeParse(req.body); // validación (infra)
  const nuevo = await productService.createProduct(result.data); // caso de uso (aplicación)
  res.status(201).json(nuevo); // adaptador HTTP
};
```

Sustituir un adaptador (por ejemplo, Express -> Fastify o SQLite -> Postgres) implica cambiar solo la capa de infraestructura y el cableado, manteniendo dominio y aplicación intactos.

## Cómo leer el flujo
1. **Entrada**: `routes -> controllers` (adaptadores primarios) reciben HTTP.
2. **Aplicación**: `services -> use-cases` aplican reglas y usan puertos.
3. **Dominio**: `value-objects/models` definen invariantes y datos.
4. **Salida**: `repositories` (adaptadores secundarios) hablan con la BD a través de los puertos.

Esta separación facilita probar cada parte en aislamiento (como en `tests/*` con repos en memoria) y cambiar detalles sin romper el núcleo de negocio.
