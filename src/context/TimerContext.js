import React, {createContext, useReducer} from 'react';

export const TimerContext = createContext();

const initialState = {
  timers: [],
  history: [],
};

function timerReducer(state, action) {
  switch (action.type) {
    case 'ADD_TIMERS':
      return {...state, timers: action.payload};
    case 'ADD_TIMER':
      return {...state, timers: [...state.timers, action.payload]};
    case 'UPDATE_TIMER':
      return {
        ...state,
        timers: state.timers.map(timer =>
          timer.id === action.payload.id ? action.payload : timer,
        ),
      };
    case 'ADD_HISTORY':
      return {...state, history: [...state.history, action.payload]};
    case 'CLEAR_ALL_TIMERS':
      return {...state, timers: []};
    default:
      return state;
  }
}

export const TimerProvider = ({children}) => {
  const [state, dispatch] = useReducer(timerReducer, initialState);

  return (
    <TimerContext.Provider value={{state, dispatch}}>
      {children}
    </TimerContext.Provider>
  );
};
