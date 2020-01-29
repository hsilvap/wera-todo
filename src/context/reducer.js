import { initialState } from './store'
export const StoreActions = {
    LOGIN: 'LOGIN',
    LOGOUT: 'LOGOUT',
    CREATE_NEW: 'CREATE_NEW',
    CANCEL_CREATE_NEW: 'CANCEL_CREATE_NEW',
}


export function StoreReducer(state, action) {
    switch (action.type) {
        case StoreActions.LOGIN: {
            const { data } = action;
            return { ...state, ...data };
        }
        case StoreActions.LOGOUT: {
            return initialState;
        }
        case StoreActions.CREATE_NEW: {
            return {...state, createNew :true};
        }
        case StoreActions.CANCEL_CREATE_NEW: {
            return {...state, createNew :false};
        }
        default: {
            throw new Error(`Unhandled action type: ${action.type}`)
        }
    }
}
