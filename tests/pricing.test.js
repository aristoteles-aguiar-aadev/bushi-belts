import test from 'node:test';
import assert from 'node:assert/strict';
import { priceOrder } from '../src/domain/catalog.js';

test('recalcula preços sem confiar no total do navegador', () => {
  assert.equal(priceOrder([{ baseBeltId: 'adult-black', size: 'A2', qty: 2, name: 'Ana', total: 0.01 }]).total, 469.8);
});
test('rejeita catálogo, tamanho e quantidades inválidos', () => {
  for (const patch of [{ baseBeltId: 'fake' }, { size: 'M0' }, { qty: -1 }, { qty: 1.5 }, { qty: 100 }]) {
    assert.throws(() => priceOrder([{ baseBeltId: 'adult-black', size: 'A2', qty: 1, ...patch }]));
  }
  assert.throws(() => priceOrder([]));
});
test('bordado de academia também tem adicional e valores usam centavos', () => {
  assert.equal(priceOrder([{ baseBeltId: 'adult-white', size: 'A0', qty: 3, academy: 'Equipe' }]).total, 314.7);
});
test('rejeita graus e variações incompatíveis com a faixa', () => {
  for (const patch of [{ stripes: 7 }, { stripes: -1 }, { stripes: 0.5 }, { kidsVariant: 'black' }]) {
    assert.throws(() => priceOrder([{ baseBeltId: 'adult-black', size: 'A2', qty: 1, ...patch }]));
  }
});
test('faixa vermelha aceita sete graus e rejeita oito', () => {
  assert.doesNotThrow(() => priceOrder([{ baseBeltId: 'adult-red', size: 'A2', qty: 1, stripes: 7 }]));
  assert.throws(() => priceOrder([{ baseBeltId: 'adult-red', size: 'A2', qty: 1, stripes: 8 }]));
});
