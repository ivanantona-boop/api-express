const { test, describe } = require('node:test');
const assert = require('assert/strict');

const { EmailVO } = require('../dist/domain/value-objects/email.vo');
const { IdVO } = require('../dist/domain/value-objects/id.vo');

describe('Value Objects', () => {
  test('EmailVO normaliza y devuelve string/valor', () => {
    // Arrange + Act: creamos el VO con espacios y mayúsculas
    const email = EmailVO.create(' User@Test.com ');
    // Assert: el VO normaliza y expone el mismo valor en value/toString/valueOf
    assert.equal(email.value, 'user@test.com');
    assert.equal(email.toString(), 'user@test.com');
    assert.equal(email.valueOf(), 'user@test.com');
  });

  test('EmailVO lanza error si el email es inválido', () => {
    // Un formato incorrecto debe disparar la validación interna
    assert.throws(() => EmailVO.create('invalido'), /Email inválido/);
  });

  test('IdVO acepta enteros positivos y rechaza el resto', () => {
    // Valor correcto
    const id = IdVO.create(3);
    assert.equal(id.value, 3);
    // Valores inválidos: cero, negativos y no enteros
    assert.throws(() => IdVO.create(0), /Id inválido/);
    assert.throws(() => IdVO.create(-1), /Id inválido/);
    assert.throws(() => IdVO.create(1.5), /Id inválido/);
  });
});
