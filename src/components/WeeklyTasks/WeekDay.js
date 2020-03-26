import React from 'react'
import {withStyles } from '@material-ui/core'
import List from '@material-ui/core/List';
import ListSubheader from '@material-ui/core/ListSubheader';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import NewWeekDayTask from './NewWeekDayTask';
import EditWeekDayTask from './EditWeekDayTask';
import { green } from '@material-ui/core/colors';
import db, { getCurrentUser } from '../../db';

const styles = () =>({
    taskWrapper:{
        direction: 'initial',
    },
})
 
const GreenCheckbox =  withStyles({
    root: {
      '&$checked': {
        color: green[600],
      },
    },
    checked: {},
  })(props => <Checkbox color="default" {...props} />);

const WeekDay = ({day,tasks,classes}) => {
    const handleComplete = async (e,uid)=>{
        await db.firestore().collection('tasks').doc(getCurrentUser().uid).collection(day).doc(uid).update({complete: e.target.checked});
    }
    const handleDelete = async (uid) =>{
        await db.firestore().collection('tasks').doc(getCurrentUser().uid).collection(day).doc(uid).delete()
    }
    return (
        <div className={classes.taskWrapper}>
            <ListSubheader style={{backgroundColor: 'white', fontWeight: 'bolder', marginBottom: '1em'}}>{day}</ListSubheader>
            <List disablePadding >
                {tasks.map(single => {
                    const labelId = `checkbox-list-label-${single.task}`;
                    return(
                    <ListItem key={single.uid} dense>
                        <EditWeekDayTask current={single} day={day}/>
                        <ListItemSecondaryAction >
                            <>
                            <IconButton onClick={()=> handleDelete(single.uid)} edge="end" aria-label="delete" >
                                <DeleteIcon />
                            </IconButton>
                            <GreenCheckbox
                                onChange={(e)=> handleComplete(e, single.uid)}
                                checked={single.complete}
                                edge="end"
                                tabIndex={-1}
                                inputProps={{ 'aria-labelledby': labelId }}
                            />
                            </>
                           
                        </ListItemSecondaryAction>
                    </ListItem>
                    )
                })}
            </List>
            <NewWeekDayTask day={day}/>

        </div>
    )
}

export default withStyles(styles)(WeekDay) 