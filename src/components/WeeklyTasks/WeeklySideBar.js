import React, { useContext } from 'react'
import { withStyles } from '@material-ui/core'
import { StoreContext } from '../../context/store'

import WeekDay from './WeekDay'


const styles= () =>({
    root:{
        width: '14rem',
        maxWidth: '14rem',
        direction: 'rtl',
        boxShadow: '0 2px 2px 0 rgba(0,0,0,.14), 0 3px 1px -2px rgba(0,0,0,.2), 0 1px 5px 0 rgba(0,0,0,.12)',
    },
    header: {
        backgroundColor: '#0288d1 !important',
        alignItems: 'center',
        color: '#FFF !important',
        boxShadow: '0 2px 2px 0 rgba(0,0,0,.14), 0 3px 1px -2px rgba(0,0,0,.2), 0 1px 5px 0 rgba(0,0,0,.12)',
        height: '30px',
        userSelect: 'none',
    },
    container:{
        height: 'calc(100vh - 92px)',
        overflowY:'auto',
    }
})

const WeeklySideBar = ({classes}) => {
    const { state } = useContext(StoreContext);
    
    return(
        <div className={classes.root}>
            <div className={classes.header}>Weekly recurrent activities</div>
            <div id='weeklytaskscontainer'className={classes.container}> {Object.entries(state.weeklyTasks).map(day => <WeekDay key={day[0]}day={day[0]}tasks={day[1]}/>)} </div>
        </div>
    )

}

export default withStyles(styles)(WeeklySideBar)