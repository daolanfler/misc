import { effect, reactive } from "./reactive.js";

const p = reactive(new Map([["key", 1]]));

effect(() => {
  console.log(p.get("key"));
});

p.set("key", 2);