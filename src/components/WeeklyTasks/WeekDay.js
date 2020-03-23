import React from 'react'
import { Typography, TextField } from '@material-ui/core'
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';

const WeekDay = () => {

    return (
        <div>
            <Typography variant='span' align='center'>Monday</Typography>
            <List >
                {[0, 1, 2, 3].map(value => {
                    const labelId = `checkbox-list-label-${value}`;
                    return(
                    <ListItem key={value} role={undefined} dense  >
                        <ListItemText id={labelId} primary={`Line item ${value + 1}`} />
                        <ListItemSecondaryAction>
                            <IconButton edge="end" aria-label="comments">
                                <DeleteIcon />
                            </IconButton>
                            <Checkbox
                                //checked={checked.indexOf(value) !== -1}
                                edge="end"
                                tabIndex={-1}
                                disableRipple
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