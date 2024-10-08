// 懒惰函数，执行一次之后，this.call重新赋值成真正要执行的函数
const CALL_DELEGATE = function (...args) {
    this.call = this._createCall("sync");
    return this.call(...args);
};

class Hook {
    constructor(args, name = undefined) {
        this._args = args;
        this.name = name;
        // 保存通过tap注册的内容
        this.taps = [];
        // 保存拦截器相关内容 我们暂时先忽略拦截器
        this.interceptors = [];
        // hook.call 调用方法
        this._call = CALL_DELEGATE;
        this.call = CALL_DELEGATE;
        // _x存放hook中所有通过tap注册的函数
        this._x = undefined;

        // 动态编译方法
        this.compile = this.compile;
        // 相关注册方法
        this.tap = this.tap;
    }
    compile(options) {
        throw new Error('Abstract: should be overridden');
    }

    // 编译最终生成的执行函数的方法
    // compile是一个抽象方法 需要在继承Hook类的子类方法中进行实现
    _createCall(type) {
        return this.compile({
            taps: this.taps,
            // interceptors: this.interceptors, 先忽略拦截器
            args: this._args,
            type: type,
        });
    }

    tap(options, fn) {
        // 这里额外多做了一层封装 是因为this._tap是一个通用方法
        // 这里我们使用的是同步 所以第一参数表示类型传入 sync
        // 如果是异步同理为sync、promise同理为 promise 这样就很好的区分了三种注册方式
        this._tap('sync', options, fn);
    }
    _tap(type, options, fn) {
        if (typeof options === 'string') {
            options = {
                name: options.trim(),
            };
        } else if (typeof options !== 'object' || options === null) {
            // 如果非对象或者传入null
            throw new Error('Invalid tap options');
        }
        // 那么此时剩下的options类型仅仅就只有object类型了
        if (typeof options.name !== 'string' || options.name === '') {
            // 如果传入的options.name 不是字符串 或者是 空串
            throw new Error('Missing name for tap');
        }
        // 合并参数 { type, fn,  name:'xxx'  }
        options = Object.assign({ type, fn }, options);
        // 将合并后的参数插入
        this._insert(options)
    }
    _resetCompilation() {
        this.call = this._call;
    }
    _insert(item) {
        this._resetCompilation();
        this.taps.push(item)
    }
}

module.exports = Hook