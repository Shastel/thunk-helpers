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

export function withDispatch (action) {
    return function(dispatch, getState, ...rest) {
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

    return useWith(actionWrapper, [ identity, f => f() ]);
}

export function withSelectors (action, selectors) {
    const actionWrapper = withState(action);

    if ('function' === typeof selectors) {
        return useWith(actionWrapper, [ identity, (s) => selectors(s)]);
    }

    return useWith(actionWrapper, [ identity, (s) => selectors.map(selector => selector(s))]);
}
