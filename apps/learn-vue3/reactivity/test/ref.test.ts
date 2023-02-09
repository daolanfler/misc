import { expect, test, vi } from 'vitest';
import { effect, watch } from '../index';
import { ref } from '../ref';

test('watch a ref basic', () => {
  const count = ref(0);
  const cb = vi.fn(() => 0);
  watch(count, cb);
  count.value = 2;
  expect(cb).toHaveBeenCalledTimes(1);
});

test('watch a ref with immediate set to true', () => {
  const count = ref(1);
  const cb = vi.fn((val) => val.value);
  watch(count, cb, {
    immediate: true,
  });
  count.value = 2;
  expect(cb).toHaveBeenCalledTimes(2);
  expect(cb).toHaveNthReturnedWith(1, 1);
  expect(cb).toHaveNthReturnedWith(2, 2);
});

test('watchEffect (effct) with sync callback', () => {
  const name = ref('bob');
  const age = ref(80);
  const cb = vi.fn(() => `${name.value} - ${age.value}`);
  effect(cb);
  expect(cb).toHaveBeenCalledTimes(1);
  name.value = 'dylan';
  age.value = 86;
  expect(cb).toHaveBeenCalledTimes(3);
});

test('watchEffect (effect) with async callback', async () => {
  const name = ref('bob');
  const age = ref(80);
  const albumn = ref(40);
  const cb = vi.fn(async () => {
    const text = name.value;
    if (age.value === 100) {
      console.log(100);
    }
    await Promise.resolve();
    if (albumn.value === 41) {
      console.log(41);
    }
    return text;
  });
  effect(cb);
  expect(cb).toHaveBeenCalledTimes(1);
  name.value = 'dylan';
  age.value = 86;
  albumn.value = 41;
  // await Promise.resolve();
  expect(cb).toHaveBeenCalledTimes(3);
});
