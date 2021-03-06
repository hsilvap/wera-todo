import React, { useReducer } from 'react'
import { StoreReducer } from './reducer';

export const initialState = {
    loggedIn: false,
    createNew: false,
    editTask: false,
    showNotification: false,
    showCompleted: false,
    user: {},
    weeklyTasks:{
        monday: [],
        tuesday: [],
        wednesday: [],
        thursday: [],
        friday: []
    },
    toDos: [],
    completedToDos: [],
    task: {},
    taskEdit: {},
    notification: ''
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