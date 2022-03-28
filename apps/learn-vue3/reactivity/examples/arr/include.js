import { effect, reactive } from "../../index.js";

const obj = {};
const arr = reactive([obj]);

// expect both bellow to be true
console.log(arr.includes(arr[0]));
console.log(arr.includes(obj));

console.log(arr.find((item) => item === obj));

const reativeObj = arr.find((item) => item === arr[0]);

// 在 vue3 中，在 reactiveObj 上增加属性 bar ，watchEffect 中的回调会执行
effect(() => {
  console.log(reativeObj);
});
reativeObj.bar = "foo";
