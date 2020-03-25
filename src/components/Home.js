import React, { useContext } from 'react';
import { withStyles } from '@material-ui/core/styles';

import Task from './Task';
import Header from './Header';
import NewTaskFab from './NewTaskFab';
import NewTask from './NewTask';
import EditTask from './EditTask';
import NotificationSnack from './NotificationSnack';
import WeeklySideBar from './WeeklyTasks/WeeklySideBar';

import { StoreContext } from '../context/store';
import { LoadMondayTasks, LoadTasks, LoadTuesdayTasks, LoadWednesdayTasks, LoadFridayTasks, LoadThursdayTasks } from '../hooks/useDb';

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
        display: 'flex',
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
        alignItems: 'baseline',
        height: '100%'
    }
})


const Home =({ classes })=> {
    const { state } = useContext(StoreContext)
    LoadTasks()
    LoadMondayTasks()
    LoadTuesdayTasks()
    LoadWednesdayTasks()
    LoadThursdayTasks()
    LoadFridayTasks()

    return (
        <div className="App">
            <Header />
            <div className={classes.wrapper}>
                {state.loggedIn && 
                <>
                    <WeeklySideBar/>
                    <div className={classes.cardContainer}>
                        { state.showCompleted === false ? state.toDos.map(todo=> <Task todo={todo} userUid={state.user.uid} key={todo.uid} />)
                        :  state.completedToDos.map(todo=> <Task todo={todo} userUid={state.user.uid} key={todo.uid}/>)
                        }
                    </div>
                </>}
            </div>
            <EditTask/>
            <NewTask/>
            <NewTaskFab/>
            <NotificationSnack/>
        </div>
    );
}


export default withStyles(styles)(Home);
