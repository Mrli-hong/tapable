const SyncHook = require('./mytapable/SyncHook');

const hooks = new SyncHook(['arg1', 'arg2'])

hooks.tap('hook1', () => {
    console.log('hook1');
})

hooks.tap('hook2', () => {
    console.log('hook2');
})


hooks.call(); 