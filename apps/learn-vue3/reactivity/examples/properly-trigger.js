import { effect, reactive } from "../index.js";

const obj = {}; 
const proto = {bar: 1};
const child = reactive(obj);

const parent = reactive(proto);

Object.setPrototypeOf(child, parent);

effect(() => {
  console.log(child.bar);
});

child.bar = 2;

console.log(child.raw === obj);
console.log(parent.raw === proto);