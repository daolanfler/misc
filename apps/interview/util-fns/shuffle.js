export const isComplexDataType = (obj) =>
    (typeof obj === "function" || typeof obj === "object") && obj !== null;

export const shuffle = function (arr) {
    for (let i = 0; i < arr.length; i++) {
        let rIndex = i + Math.floor((arr.length - i) * Math.random());
        [arr[i], arr[rIndex]] = [arr[rIndex], [arr[i]]];
    }
};

function shuffle2(arr) {
    let _arr = [];
    while (arr.length) {
        let index = Math.floor(Math.random * arr.length);
        _arr.push(arr.splice(index, 1)[0]);
    }
    return _arr;
}

export const promisify = function (asyncFn) {
    return function (...args) {
        return new Promise((resolve, reject) => {
            args.push(function (err, ...rest) {
                if (err) {
                    reject(err);
                } else {
                    resolve(...rest);
                }
            });
            asyncFn.apply(this, args);
        });
    };
};

// for an example
// const fs = require('fs')
// const fsp = new Proxy(fs, {
//     get(target, key) {
//         return promisify(target[key])
//     }
// })
// await fsp.readFile('./index.js', 'utf-8')

export class EventEmitter {
    constructor() {
        this.subs = {};
    }

    on(event, cb) {
        (this.subs[event] || (this.subs[event] = [])).push(cb);
    }

    trigger(event, ...args) {
        this.subs(event) &&
      this.subs[event].forEach((cb) => {
          cb(...args);
      });
    }

    off(event, offCb) {
        if (this.subs[event]) {
            let index = this.subs[event].findIndex((handler) => handler === offCb);
            this.subs[event].splice(index, 1);
            !this.subs[event].length && delete this.subs[event];
        }
    }

    once(event, cb) {
        const oncedCb = (...args) => {
            cb(...args);
            this.off(event, oncedCb);
        };
        this.on(event, oncedCb);
    }
}
