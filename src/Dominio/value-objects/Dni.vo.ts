// src/Dominio/value-objects/dni.vo.ts

export class DniVO {
  private readonly value: string;

  private constructor(dni: string) {
    this.value = dni;
  }

  public static crear(dni: string): DniVO {
    // 1. Normalización (Requisito del pto 6):
    // Quitar espacios y convertir letra a MAYÚSCULA
    const dniLimpio = dni.trim().toUpperCase();

    // 2. Validación de Dominio:
    // Debe tener entre 1 y 20 caracteres (para ser flexible)
    // o usar una regex estricta española si prefieres: /^[0-9]{8}[A-Z]$/
    if (dniLimpio.length === 0) {
      throw new Error('El DNI no puede estar vacío');
    }

    // Aquí podrías añadir lógica compleja: Calcular si la letra coincide con los números

    return new DniVO(dniLimpio);
  }

  public getValue(): string {
    return this.value;
  }
}
