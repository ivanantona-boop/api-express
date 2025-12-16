// Value Object: encapsula la semántica y validación de un email.
// (SRP - Single Responsibility Principle): un único lugar que sabe validar/normalizar correos.
export class EmailVO {
  private constructor(private readonly _value: string) {}

  static create(raw: string) {
    const normalized = raw.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalized)) {
      throw new Error('Email inválido');
    }
    return new EmailVO(normalized);
  }

  get value() {
    return this.valueOf();
  }

  valueOf() {
    return this.toString();
  }

  toString() {
    return this._value;
  }
}
