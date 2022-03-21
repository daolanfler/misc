const memorize = (initial, cb) => {
    const resultFn = n => {
        if (initial[n] === undefined) {
            // not recorded 
            initial[n] = cb(n, resultFn)
        }
        return initial[n]
    }
    return resultFn
}


const factorial = memorize([1, 1], (n, fn) => n * fn(n - 1))

console.log(factorial(10))