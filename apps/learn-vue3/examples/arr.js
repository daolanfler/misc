import { reactive, effect } from "../index.js";

const arr =reactive(['foo', "bar"]);

// effect(() => {
//   console.log(arr[0]);
// });

// arr[0] = "bar";

// effect(() => {
//   console.log(arr[1]);
// });

// arr.length = 1;

effect(() => {
  for (const key in arr) {
    // 如果是 empty 则不会被遍历
    console.log(key);
  }
});

arr.length = 3;