import { initialState } from './store'
import db from '../db';


export const StoreActions = {
    LOGIN: 'LOGIN',
    LOGOUT: 'LOGOUT',
    CREATE_NEW: 'CREATE_NEW',
    SAVE: 'SAVE',
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
        case StoreActions.SAVE: {
            const { data } = action;
            const uid = db.auth().currentUser.uid;
            //console.log(db.auth())
            var ola = db.firestore().collection('tasks').doc(uid).collection('todo').add(data);
            //var ola = db.firestore().collection('tasks').add({test: 'abc'});
            ola.then(function(){
                console.log('kek')
            })
        
        
        }
        case StoreActions.CANCEL_CREATE_NEW: {
            return {...state, createNew :false};
        }
        default: {
            throw new Error(`Unhandled action type: ${action.type}`)
        }
    }
}
