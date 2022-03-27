import { reactive, effect } from "./reactive.js";

const p = reactive(new Map([
  ['key1', 'value1'],
  ['key2', 'value2'],
]));

effect(() => {
  for (const [key, value] of p.entries()) {
    console.log(key, value);
  }
});

p.set('key1', 'value111'); // 期望触发响应