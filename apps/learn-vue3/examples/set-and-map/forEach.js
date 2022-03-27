import { effect, reactive } from "./reactive.js";

// const p = reactive(new Map([[{key: 1}, {value: 1}]]));

// effect(() => {
//   p.forEach((value, key, m) => {
//     console.log(value)
//     console.log(key)
//   })
// })

// p.set({key: 2}, {value: 2});

// callback 中的 value 也应该是响应式的数据;
// const key = { key: 1 };
// const value = new Set([1, 2, 3]);

// const p = reactive(new Map([[key, value]]));

// effect(() => {
//   p.forEach((value, key) => {
//     console.log(value.size);
//   });
// });

// p.get(key).delete(1);

const p = reactive(new Map([["key", 1]]));

effect(() => {
  p.forEach((value, key) => {
    console.log(value);
  });
});

p.set("key", 2); // 期望触发响应
