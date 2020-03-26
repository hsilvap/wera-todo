import React from 'react'
import {withStyles } from '@material-ui/core'
import List from '@material-ui/core/List';
import ListSubheader from '@material-ui/core/ListSubheader';
import ListItem from '@material-ui/core/ListItem';
import Tooltip from '@material-ui/core/Tooltip';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import NewWeekDayTask from './NewWeekDayTask';
import { green } from '@material-ui/core/colors';

const styles = () =>({
    taskWrapper:{
    
        direction: 'initial',
    },
    taskNameWrapper:{
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        maxWidth: '7rem',
        border: 'none',
        '&:focus':{
            outline: 'none'
        }
    }
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
    
    return (
        <div className={classes.taskWrapper}>
            <ListSubheader style={{backgroundColor: 'white', fontWeight: 'bolder'}}>{day}</ListSubheader>
            <List disablePadding >
                {tasks.map(single => {
                    const labelId = `checkbox-list-label-${single.task}`;
                    return(
                    <ListItem key={single.uid} denses>
                        <Tooltip title={single.task}>
                            <input id={labelId} className={classes.taskNameWrapper} value={single.task} />
                        </Tooltip>
                        <ListItemSecondaryAction >
                            <>
                            <IconButton edge="end" aria-label="delete" disableFocusRipple={true} disableRipple={true}>
                                <DeleteIcon />
                            </IconButton>
                            <GreenCheckbox
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