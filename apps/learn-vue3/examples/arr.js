import { reactive, effect } from "../index.js";

const arr =reactive(['foo', "bar"]);

// effect(() => {
//   console.log(arr[0]);
// });

// arr[0] = "bar";

effect(() => {
  console.log(arr[1]);
});

arr.length = 1;