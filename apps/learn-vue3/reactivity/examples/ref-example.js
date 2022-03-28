import { effect } from "../index.js";
import { ref } from "../ref.js";

const refVal = ref(1);

effect(() => {
  console.log(refVal.value);
});

refVal.value = 2;