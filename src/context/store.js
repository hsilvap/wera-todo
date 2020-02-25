import React, { useReducer } from 'react'
import { StoreReducer } from './reducer';

export const initialState = {
    loggedIn: false,
    createNew: false,
    editTask: false,
    user: {},
    toDos: [],
    completedToDos: [],
    task: {},
    taskEdit: {}
}

export const StoreContext = React.createContext();

export const StoreProvider = ({ children }) => {
    const [state, dispatch] = useReducer(StoreReducer, initialState);
    return (
        <StoreContext.Provider value={{ state, dispatch }}>
            {children}
        </StoreContext.Provider>
    )
}