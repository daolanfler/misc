import { effect, ref } from "@vue/reactivity";

function renderer(domString, container) {
  container.innerHTML = domString; 

}

const count = ref(1);

effect(() => {
  renderer(`<div>${count.value}</div>`, document.getElementById('app'));
});

count.value ++; 