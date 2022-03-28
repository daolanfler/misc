import { effect, reactive } from "../index.js";

const obj = {
  foo: 1,
  get bar() {
    return this.foo;
  },
};

const p = reactive(obj);

effect(() => {
  for (const key in p) {
    console.log(key);
  }
});

p.foo = 1;
