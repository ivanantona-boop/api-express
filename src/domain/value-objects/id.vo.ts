// Value Object: asegura que los IDs sean enteros positivos.
// Encapsula la regla en un lugar (SRP - Single Responsibility Principle) y la reutiliza en casos de uso.
export class IdVO {
  private constructor(private readonly _value: number) {}

  static create(raw: number) {
    if (!Number.isInteger(raw) || raw <= 0) {
      throw new Error('Id inválido');
    }
    return new IdVO(raw);
  }

  get value() {
    return this._value;
  }
}
