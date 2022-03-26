
import { effect, reactive, watch } from "../index.js";

const p = reactive({
  foo: 1
});

watch(
  () => p.foo,
  (value, oldVal) => {
    console.log("数据变化了", value, oldVal);
  },
  {
    immediate: true,
  }
);

p.foo++;