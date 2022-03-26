// watch 中 effect 回调的 onInvalidate 参数
function cb(onInvalidate) {
  let expire = false;

  onInvalidate(() => {
    expire = true;
  });
  Promise.resolve().then(() => {
    console.log("expire value is: ", expire);
    if (!expire) {
      console.log("something you should do as not expired");
    }
  });
}

let cleanup;
function other() {
  function onInvalidate(fn) {
    cleanup = fn;
  }
  if (cleanup) {
    cleanup();
  }
  cb(onInvalidate);
}

other();
other(); // other 的调用是同步执行的，第二次执行时，cleanup(存在) 会将第一次执行时 cb 内部的 expire 设置为true，then 中的微任务按顺序执行
