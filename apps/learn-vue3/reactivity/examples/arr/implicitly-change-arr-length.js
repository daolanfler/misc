import { effect, reactive } from "../../index.js";

const arr = reactive([]);

effect(() => {
  arr.forEach((item) => { 
    console.log(item);
  });
});


effect(() => {
  arr.push(1);
});
effect(() => {
  arr.push(1);
});
