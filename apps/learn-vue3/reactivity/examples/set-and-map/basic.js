import { effect, reactive } from "./reactive.js";

// const proxy = reactive(new Map([["key", 1]]));

// effect(() => {
//   console.log(proxy.get("key"));
// });

// proxy.set('key', 2);

const s = new Set([1, 2, 3]);

// const p = new Proxy(s, {
//   get(target, key, receiver) {
//     if (key === "size") {
//       // size 是一个访问器属性，需要将它的 this 设置为 target
//       return Reflect.get(target, key, target);
//     }
//     // return Reflect.get(target, key, receiver);
//     return target[key].bind(target);
//   },
// });

// // delete 中的 this 也要指向 target
// p.delete(1);

// console.log(p.size);

const p = reactive(new Set([1, 2, 3]));
effect(() => {
  console.log(p.size);
});

p.add(1);
