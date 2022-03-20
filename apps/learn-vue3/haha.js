function cb(onInvalidate) {
  let expire = false;

  onInvalidate(() => {
    expire = true;
  });
  Promise.resolve().then(() => {
    console.log('expire value is: ', expire)
    if (!expire) {
      console.log("hahahah");
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
other();
