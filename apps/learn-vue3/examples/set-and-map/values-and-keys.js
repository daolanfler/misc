import { reactive, effect } from "./reactive.js";

const p = reactive(new Map([
  ['key1', 'value1'],
  ['key2', 'value2'],
]));

// effect(() => {
//   for (const value of p.values()) {
//     console.log(value);
//   }
// });

// p.set('key1', 'value111'); // 期望触发响应


effect(() => {
  for (const value of p.keys()) {
    console.log(value);
  }
});

p.set('key2', 'value3'); // 不触发响应 
p.set('key3', 'value3'); // 能触发响应 
