const Hook = require("./Hook");
const HookCodeFactory = require('./HookCodeFactory');

const TAP_ASYNC = () => {
    throw new Error("tapAsync is not supported on a SyncHook");
};

const TAP_PROMISE = () => {
    throw new Error("tapPromise is not supported on a SyncHook");
};

class SyncHookCodeFactory extends HookCodeFactory {
    // 关于 content 方法 你可以先忽略它
    content({ onError, onDone, rethrowIfPossible }) {
        return this.callTapsSeries({
            onError: (i, err) => onError(err),
            onDone,
            rethrowIfPossible,
        });
    }
}

const factory = new SyncHookCodeFactory();



function COMPILE(options) {
    factory.setup(this, options);
    return factory.create(options);
}


function SyncHook(args = [], name = undefined) {
    // hook 的原型以及构造函数均为Hook的
    const hook = new Hook(args, name);

    hook.constructor = SyncHook;
    hook.tapAsync = TAP_ASYNC;
    hook.tapPromise = TAP_PROMISE;
    hook.compile = COMPILE;
    return hook;

}

SyncHook.prototype = null;

module.exports = SyncHook