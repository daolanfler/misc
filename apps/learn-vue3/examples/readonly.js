import { readonly } from "../index.js";

const obj = readonly({ foo: 1 });

obj.foo = 2;
