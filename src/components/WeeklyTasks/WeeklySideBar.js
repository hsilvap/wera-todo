import React from 'react'
import { withStyles } from '@material-ui/core'
import WeekDay from './WeekDay'

const styles= () =>({
    root:{
        display: 'grid',
        gridTemplateRows: 'auto 1fr 1fr 1fr 1fr 1fr',
        width: '13rem',
        maxWidth: '13rem',
        overflowY:'auto',
        direction: 'rtl',
    },
    header: {
        backgroundColor: '#0288d1 !important',
        alignItems: 'center',
        color: '#FFF !important',
        boxShadow: '0 2px 2px 0 rgba(0,0,0,.14), 0 3px 1px -2px rgba(0,0,0,.2), 0 1px 5px 0 rgba(0,0,0,.12)',
        height: '2rem'
    }
})

const WeeklySideBar = ({classes}) => {
    const days = ['Monday','Tuesday','Wednesday','Thursday','Friday']
    return(
        <div className={classes.root}>
            <div className={classes.header}>Weekly activities  </div>
            {days.map(day=> <WeekDay key={day}>{day}</WeekDay>)}
        </div>
    )

}

export default withStyles(styles)(WeeklySideBar)