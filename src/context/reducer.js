import { initialState } from './store'
import db from '../db';


export const StoreActions = {
    LOGIN: 'LOGIN',
    LOGOUT: 'LOGOUT',
    CREATE_NEW: 'CREATE_NEW',
    EDIT_TASK: 'EDIT_TASK',
    SAVE: 'SAVE',
    CANCEL_CREATE_NEW: 'CANCEL_CREATE_NEW',
    CANCEL_EDIT_TASK: 'CANCEL_EDIT_TASK',
    RECIEVE_TASKS: 'RECIEVE_TASKS',
    SHOW_NOTIFICATION: 'SHOW_NOTIFICATION',
    HIDE_NOTIFICATION: 'HIDE_NOTIFICATION',
    TOGGLE_COMPLETED: 'TOGGLE_COMPLETED',
    SET_MONDAY:'SET_MONDAY',
    SET_TUESDAY:'SET_TUESDAY',
    SET_WEDNESDAY:'SET_WEDNESDAY',
    SET_THURSDAY:'SET_THURSDAY',
    SET_FRIDAY:'SET_FRIDAY',
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
            return { ...state, createNew: true };
        }
        case StoreActions.RECIEVE_TASKS: {
            const { data } = action;
            const prev = { ...state }
            return { ...state, toDos: [...prev.toDos, ...data] };
        }
        case StoreActions.TOGGLE_COMPLETED: {
            const { data } = action;
            return { ...state, showCompleted: data };
        }
        case StoreActions.SAVE: {
            const { data } = action;
            const uid = db.auth().currentUser.uid;
            const save = db.firestore().collection('tasks').doc(uid).collection('todo').add(data);
            return save.then(function () {
                return { ...state }
            })

        }
        case StoreActions.CANCEL_CREATE_NEW: {
            return { ...state, createNew: false };
        }
        case StoreActions.EDIT_TASK: {
            const { data } = action;
            return { ...state, editTask: true, taskEdit: { ...data.todo, ...data.uid } };
        }
        case StoreActions.CANCEL_EDIT_TASK: {
            return { ...state, editTask: false };
        }
        case StoreActions.SET_MONDAY: {
            const { data } = action;
            return { ...state, weeklyTasks:{...state.weeklyTasks, monday : data}};
        }
        case StoreActions.SET_TUESDAY: {
            const { data } = action;
            return { ...state, weeklyTasks:{ ...state.weeklyTasks,tuesday : data}};
        }
        case StoreActions.SET_WEDNESDAY: {
            const { data } = action;
            return { ...state, weeklyTasks:{ ...state.weeklyTasks,wednesday : data}};
        }
        case StoreActions.SET_THURSDAY: {
            const { data } = action;
            return { ...state, weeklyTasks:{ ...state.weeklyTasks,thursday : data}};
        }
        case StoreActions.SET_FRIDAY: {
            const { data } = action;
            return { ...state, weeklyTasks:{ ...state.weeklyTasks,friday : data}};
        }
        case StoreActions.SHOW_NOTIFICATION: {
            const { data } = action;
            return { ...state, notification: data.notification, showNotification: true };
        } case StoreActions.HIDE_NOTIFICATION: {
            return { ...state, showNotification: false };
        }
        default: {
            throw new Error(`Unhandled action type: ${action.type}`)
        }
    }
}
