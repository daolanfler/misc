import { effect, reactive } from "../../index.js";

const proxy = reactive(new Map([["key", 1]]));

effect(() => {
  console.log(proxy.get("key"));
});

proxy.set('key', 2);