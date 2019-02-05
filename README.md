# thunk-helpers
> This package provides small helpers to improve your experience with redux-thunk
---

* [Installation](#installation)
* [Usage](#usage)

## Installation

```sh
npm install thunk-helpers
```

## Usage

```javascript
  import {
    withDispatch,
    withState,
    withSelectors,
    withDispatchAction,
    withStateAction,
    withSelectorsAction,
  } from 'thunk-helpers';

  // withDispatch expects function as argument
  // returned value will be automatically dispatched
  // it works with sync function and promises as well;
  // you may return object or array
  const fetchUser = (id) => withDispatch(async (/* dispatch, getState, ...dependencies */) => {
    const user = await fetch(`/user/${id}`);

    return { type: 'USER_FETCHED', payload: user };
  });

  // withState, works same as withDispatch, but
  // automatically call getState, and provide state
  // as argument to your action
  const exampleAction = () => withState(async (dispatch, state) => {
    const { smth } = state;

    return { type: 'EXAMPLE', payload: smth }
  });


  // withSelectors works pretty same as withState,
  // but accepts array of selector functions or 1 function
  // and replace getState with result of those functions
  () => withSelectors(async (dispatch, [ smth ])) => {
    return { type: 'EXAMPLE', payload: smth }
  }, [ someSelectorFunction ])

  // If you don't need provide any param from outside
  // All functions have 'action creator',
  // In this case inner function will be created only once
  const fetchUser = withDispatchAction(async (/* dispatch, getState, ...dependencies */) => {
    const user = await fetch('/user/me');

    return { type: 'USER_FETCHED', payload: user };
  });

  const exampleAction = withStateAction(async (dispatch, state) => {
    const { smth } = state;

    return { type: 'EXAMPLE', payload: smth }
  });

  withSelectorsAction(async (dispatch, [ smth ])) => {
    return { type: 'EXAMPLE', payload: smth }
  }, [ someSelectorFunction ])

```

## LICENSE

MIT
