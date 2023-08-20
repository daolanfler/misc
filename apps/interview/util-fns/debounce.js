function debounce(fn, delay) {
    let timer;
    return function(...args) {
        if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(() => {
            fn.apply(this, args);
            timer = null;
        }, delay);
    };
}

function debounce2(
    fn,
    delay,
    options = {
        leading: true,
        context: null
    }
) {
    let timer;
    const _debounce = function(...args) {
        if (timer) {
            clearTimeout(timer);
        }
        if (options.leading && !timer) {
            timer = setTimeout(null, delay);
            fn.apply(options.context, args);
        } else {
            timer = setTimeout(() => {
                fn.apply(options.context, args);
                timer = null;
            }, delay);
        }
    };
    _debounce.cancel = function() {
        clearTimeout(timer);
        timer = null;
    };
    return _debounce;
}
