# thunk-helpers

---

* [Installation](#installation)
* [Usage](#usage)

## Installation

```sh
npm install thunk-helpers
```

## Usage

```javascript
  import { withDispatch, withState, withSelectors } from 'thunk-helpers';

  // withDispatch expects function as argument
  // returned value will be automatically dispatched
  // it works with sync function and promises as well;
  // you may return object or array
  const fetchUser = withDispatch(async (/* dispatch, getState, ...dependencies */) => {
    const user = await fetch('/user/me');

    return { type: 'USER_FETCHED', payload: user };
  });

  // withState, works same as withDispatch, but
  // automatically call getState, and provide state
  // as argument to your action
  const exampleAction = withState(async (dispatch, state) => {
    const { smth } = state;

    return { type: 'EXAMPLE', payload: smth }
  });


  // withSelectors works pretty same as withState,
  // but accepts array of selector functions or 1 function
  // and replace getState with result of those functions
  withSelectors(async (dispatch, [ smth ])) => {
    return { type: 'EXAMPLE', payload: smth }
  }, [ someSelectorFunction ])

```

## LICENSE

MIT
