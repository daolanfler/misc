import { reactive, effect, shallowReactive } from "../index.js";

// const obj = reactive({foo: {bar: 1}});

// effect(() => {
//   console.log(obj.foo.bar);
// });

// obj.foo.bar = 2;

const obj2 = shallowReactive({ foo: { bar: 1 } });

effect(() => {
  console.log(obj2.foo.bar);
});

obj2.foo = { bar: 2 };

obj2.foo.bar = 3;
