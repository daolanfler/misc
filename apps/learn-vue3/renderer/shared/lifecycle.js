export let currentInstace = null;

export function setCurrentInstance(instance) {
  currentInstace = instance;
}

export function onMounted(fn) {
  if (currentInstace) {
    currentInstace.mounted.push(fn)
  } else {
    console.error('onMounted 只能在 setup 中调用')
  }
}

