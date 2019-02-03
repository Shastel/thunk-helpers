function useWith(func, mapfns) {
    return function(...args) {
        const newArgs = args.map((arg, i) => mapfns[i] ? mapfns[i](arg) : arg);

        func(...newArgs);
    };
}

const identity = a => a;

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
    const actionWrapper = createWrapper(action);

    const handler = useWith(actionWrapper, [ identity, f => f() ]);

    return function () {
        return handler;
    };
}

export function withSelectors (action, selectors) {
    const actionWrapper = createWrapper(action);

    let handler = identity;

    if ('function' === typeof selectors) {
        handler = useWith(actionWrapper, [ identity, (s) => selectors(s)]);
    } else {
        handler = useWith(actionWrapper, [ identity, (s) => selectors.map(selector => selector(s))]);
    }

    return function () {
        return handler;
    };
}
