import React from 'react'
import { TextField, ListSubheader, withStyles } from '@material-ui/core'
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import { green } from '@material-ui/core/colors';

const GreenCheckbox =  withStyles({
    root: {
      '&$checked': {
        color: green[600],
      },
    },
    checked: {},
  })(props => <Checkbox color="default" {...props} />);

const WeekDay = ({day,tasks}) => {

    return (
        <div style={{direction: 'initial'}}>
            <ListSubheader style={{backgroundColor: 'white'}}>{day}</ListSubheader>
            <List >
                {tasks.map(single => {
                    const labelId = `checkbox-list-label-${single.task}`;
                    return(
                    <ListItem key={single.uid} dense >
                        <ListItemText id={labelId} primary={single.task} />
                        <ListItemSecondaryAction>
                            <IconButton edge="end" aria-label="delete">
                                <DeleteIcon />
                            </IconButton>
                            <GreenCheckbox
                                checked={single.complete}
                                edge="end"
                                tabIndex={-1}
                                inputProps={{ 'aria-labelledby': labelId }}
                            />
                           
                        </ListItemSecondaryAction>
                    </ListItem>
                    )
                })}
            </List>
            <TextField label="Task" />

        </div>
    )
}

export default WeekDay