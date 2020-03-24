import { useContext, useEffect } from 'react';

import { StoreContext } from '../context/store';
import { StoreActions } from '../context/reducer';
import db, { mondayCollectionRef, getCurrentUser, taskCollectionRef } from '../db';


export function LoadMondayTasks (){
    const { dispatch } = useContext(StoreContext)

    useEffect(() => {
    var query;
        db.auth().onAuthStateChanged((user) => {
        if (user) {
        query = mondayCollectionRef(getCurrentUser().uid);
        query.onSnapshot(function (querySnapshot) {
            const tasks = [];
            querySnapshot.forEach(function (doc) {
                tasks.push({ ...doc.data(), uid: doc.id });
            });
            dispatch({ type: StoreActions.SET_MONDAY, data: tasks});
        })
       }
    })
       return () => query;
    }, [dispatch])
   
}

export function LoadTasks(){
    const { dispatch } = useContext(StoreContext)

    useEffect(() => {
        var query;
        db.auth().onAuthStateChanged((user) => {
            if (user) {
                
                const profilePicUrl = getCurrentUser().photoURL || '/images/profile_placeholder.png';
                const userName = getCurrentUser().displayName;
                const uid = getCurrentUser().uid;

                query = taskCollectionRef(uid);
                query.onSnapshot(function (querySnapshot) {
                    const tasks = [];
                    const completedTasks = [];
                    querySnapshot.forEach(function (doc) {
                        if(doc.data().complete === false){
                            tasks.push({...doc.data(), uid : doc.id});
                        }else{
                            completedTasks.push({...doc.data(), uid : doc.id});
                        }
                    });
                    dispatch({ type: StoreActions.LOGIN, data: { loggedIn: true, user: { profilePicUrl, userName, uid }, toDos: tasks , completedToDos: completedTasks } })
                })


            } else {
                dispatch({ type: StoreActions.LOGOUT })
            }
        })
        return () => query
    }, [dispatch])
}