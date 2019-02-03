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

function handleAction(dispatch, action) {
    if (null == action) {
        return;
    }

    if (Array.isArray(action)) {
        action.map((action) => handleAction(dispatch, action));
    }
}

export function withDispatch(action) {
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

export function withState (action) {
    const actionWrapper = withDispatch(action);

    return useWith(actionWrapper, [ identity, call ]);
}

export function withSelectors (action, selectors) {
    const actionWrapper = withDispatch(action);

    let handler = action;

    if ('function' === typeof selectors) {
        handler = useWith(actionWrapper, [ identity, callWith(selectors)]);
    } else {
        handler = useWith(actionWrapper, [ identity, (s) => selectors.map(arg(s))]);
    }

    return handler;
}

export function withDispatchAction (action) {
    const handler = withDispatch(action);

    return function () {
        return handler;
    };
}

export function withStateAction (action) {
    const handler = withState(action);

    return function () {
        return handler;
    };
}

export function withSelectorsAction (action, selectors) {
    const handler = withSelectors(action, selectors);

    return function () {
        return handler;
    };
}
