function run(generatorFunc) {
  let it = generatorFunc();
  let result = it.next();

  return new Promise((resolve, reject) => {
    const next = function(result) {
      if (result.done) {
        resolve(result.value);
        return;
      }

      result.value = Promise.resolve(result.value);
      result.value
        .then(res => {
          let result = it.next(res);
          next(result);
        })
        .catch(e => reject(e));
    };
    next(result);
  });
}

function* func() {
  let res1 = yield 1;
  console.log(res1);

  let res2 = yield 2;
  console.log(res2);

  let res3 = yield 3;
  console.log(res3);

  console.log(res1, res2, res3);
}

run(func);
