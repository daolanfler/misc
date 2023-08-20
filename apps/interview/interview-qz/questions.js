
Promise.all = function (promises) {
    let result = [];
    let processed = 0;

    const processData = (resolve, reject, p, index) => {
        p.then(val => {
            result[index] = val;
            processed++;
            if (processed === promises.length) {
                resolve(result);
            }
        }).catch(e => reject(e));
    };

    return new Promise((resolve, reject) => {
        for (let i = 0; i < promises.length; i++) {
            processData(resolve, reject, promises[i], i);
        }
    });
};

// jsonp 
function jsonp(url, params, cbName) {
    return new Promise((resolve, reject) => {
        const el = document.createElement('script');
        window[cbName] = function (data) {
            resolve(data);
            document.body.removeChild(el);
        };
        params = { ...params, callback: cbName };
        let arr = [];
        for (let key in params) {
            arr.push(`${key}=${params[key]}`);
        }
        el.src = `${url}?${arr.join('&')}`;
        document.body.appendChild(el);
    });
}

jsonp('https://facebook.com', { name: 'ranodm' }, 'parse1').then(data => {
    console.log(data);
});

// new 的pollyfill
function pollyNew(fn) {
    return function (...args) {
        const that = Object.create(fn.prototype);
        const obj = fn.apply(that, args);
        return typeof obj === 'object' && obj || that;
    };
}
// Object.create 
Object.pollyCreate = function (obj) {
    let F = function () { };
    F.prototype = obj;
    return new F();
};
// instanceOf 
function instanceOf(obj, ctor) {
    if (typeof obj !== 'object' || obj === null) return false;
    let proto = obj.__proto__;
    while (proto) {
        if (proto === ctor.prototype) {
            return true;
        }
        proto = proto.__proto__;
    }
    return false;

}

// es5 实现继承 
