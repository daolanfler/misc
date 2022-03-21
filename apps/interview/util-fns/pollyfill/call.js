Function.prototype.selfCall = function(context, ...args) {
    let fn = this
    context || (context = window)
    let caller = Symbol('caller')
    context[caller] = fn
    let res = context[caller](...args)
    delete context[caller]
    return res
}
