import { effect, reactive } from "./reactive.js";

const m = new Map();

const p1 =reactive(m); 

const p2 = reactive(new Map());

// 把响应式数据设置到原始数据上的行为成为数据污染
p1.set('p2', p2); 

effect(() => {
  console.log(m.get('p2').size); 
})

m.get('p2').set('foo', 1)