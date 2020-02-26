import React, { useContext, useEffect } from 'react';
import firebase from 'firebase'
import { withStyles } from '@material-ui/core/styles';
//import Typography from '@material-ui/core/Typography';
//import Unsplash , {toJson} from 'unsplash-js';

import Task from './Task';
import Header from './Header';
import NewTaskFab from './NewTaskFab';
import NewTask from './NewTask';
import EditTask from './EditTask';
import NotificationSnack from './NotificationSnack';

import { StoreContext } from '../context/store';
import { StoreActions } from '../context/reducer';
import db from '../db';
import './../App.css';



const styles = () => ({
    root: {
       display: 'flex',
       flex: 1,
    },
    wrapper: {
        /* layout */
        width: '100%',
        height: 'calc(100vh - 62px)',
        position: 'fixed',
        //backgroundImage: 'url(' + 'https://media3.giphy.com/media/1AgjJa5aX1vmIvx8Zr/giphy.gif' +')',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        overflowY: 'auto',
    },
    cardContainer:{
        flex: 1,
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        paddingTop: '5rem',
        alignItems: 'baseline',
        height: '100%'
    }
})


const Home =({ classes })=> {
    const { state, dispatch } = useContext(StoreContext)
    //const unsplash = new Unsplash({ accessKey: `${process.env.UNSPLASH_ACCESS}`,  secret: `${process.env.UNSPLASH_SECRET}`});

    useEffect(() => {
        /*

        unsplash.photos.getRandomPhoto()
        .then(toJson)
        .then(json => {
            console.log(json)
            // Your code
        });
        fetch('https://api.unsplash.com/photos/random', { headers: {
            'Authorization': `${process.env.UNSPLASH_ACCESS}`
          }
        }).then(data => data.json()).then(response=> console.log(response))
        */

    }, [])

    useEffect(() => {
        var query;
        db.auth().onAuthStateChanged((user) => {
            if (user) {
                const profilePicUrl = firebase.auth().currentUser.photoURL || '/images/profile_placeholder.png';
                const userName = firebase.auth().currentUser.displayName;
                const uid = firebase.auth().currentUser.uid;
                query = db.firestore().collection('tasks').doc(uid).collection('todo').orderBy("dueDate", "asc").where("complete", "==", state.showCompleted);
                query.onSnapshot(function (querySnapshot) {
                    const tasks = [];
                    querySnapshot.forEach(function (doc) {
                        tasks.push({...doc.data(), uid : doc.id});
                    });
                    dispatch({ type: StoreActions.LOGIN, data: { loggedIn: true, user: { profilePicUrl, userName, uid }, toDos: tasks } })
                })

            } else {
                dispatch({ type: StoreActions.LOGOUT })
            }
        })
        return () => query
    }, [dispatch,state.showCompleted])

    return (
        <div className="App">
            <Header />
            <div className={classes.wrapper}>
                <div className={classes.cardContainer}>
                { state.toDos.map(todo=> <Task todo={todo} userUid={state.user.uid} key={todo.uid} />)}
                </div>
            </div>
            <EditTask/>
            <NewTask/>
            <NewTaskFab/>
            <NotificationSnack/>
        </div>
    );
}


export default withStyles(styles)(Home);
