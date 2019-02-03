function useWith(func, mapfns) {
    return function(...args) {
        const newArgs = args.map((arg, i) => mapfns[i] ? mapfns[i](arg) : arg);

        func(...newArgs);
    };
}

const identity = a => a;
const call = f => f();
const callWith = f => a => f(a);
const arg = a => f => f(a);

function __getSelectWrapper(action, selectors) {
    const actionWrapper = createWrapper(action);

    let handler = action;

    if ('function' === typeof selectors) {
        handler = useWith(actionWrapper, [ identity, callWith(selectors)]);
    } else {
        handler = useWith(actionWrapper, [ identity, (s) => selectors.map(arg(s))]);
    }

    return handler;
}

function __getStateHandler(action) {
    const actionWrapper = createWrapper(action);

    return useWith(actionWrapper, [ identity, call ]);
}

function handleAction(dispatch, action) {
    if (null == action) {
        return;
    }

    if (Array.isArray(action)) {
        action.map((action) => handleAction(dispatch, action));
    }
}

function createWrapper(action) {
    return function __innerHandler(dispatch, getState, ...rest) {
        const result = action(dispatch, getState, ...rest);

        if (null == result) {
            return;
        }

        if (result instanceof Promise) {
            return result.then((action) => handleAction(dispatch, action));
        }

        if ('object' === typeof result) {
            return dispatch(result);
        }
    };
}


export function withDispatch (action) {
    const handler = createWrapper(action);

    return function () {
        return handler;
    };
}

export function withState (action) {
    const handler = __getStateHandler(action);

    return function () {
        return handler;
    };
}

export function withSelectors (action, selectors) {
    const handler = __getSelectWrapper(action, selectors);

    return function () {
        return handler;
    };
}

export function __withDispatch(action) {
    return createWrapper(action);
}

export function __withState (action) {
    return __getStateHandler(action);
}

export function __withSelectors (action, selectors) {
    return __getSelectWrapper(action, selectors);
}
