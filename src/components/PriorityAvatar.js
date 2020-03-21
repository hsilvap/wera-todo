import React from 'react'
import clsx from 'clsx';

import { priorities } from './NewTask'
import Avatar from '@material-ui/core/Avatar';
import { lightGreen } from '@material-ui/core/colors';
import { teal } from '@material-ui/core/colors';
import { yellow } from '@material-ui/core/colors';
import { deepOrange } from '@material-ui/core/colors';
import { red } from '@material-ui/core/colors';
import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles(theme => ({
    lightGreen: {
        backgroundColor: lightGreen[500],
    },
    teal: {
        backgroundColor: teal[500],
    },
    yellow: {
        backgroundColor: yellow[500],
    },
    deepOrange: {
        backgroundColor: deepOrange[500],
    },
    red: {
        backgroundColor: red[500],
    },
}));

const PriorityAvatar = ({ priority }) => {
    const classes = useStyles();
    const prity = priorities.find(x=> x.value === priority )
    return (
        <Avatar title={prity.label} aria-label="priority" className={clsx({ 
            [classes.lightGreen]: priority === 0,
            [classes.teal]: priority === 1,
            [classes.yellow]: priority === 2,
            [classes.deepOrange]: priority === 3,
            [classes.red]: priority === 4,
          })}>
            {prity.label[0]}
        </Avatar>
    )
}

export default PriorityAvatar