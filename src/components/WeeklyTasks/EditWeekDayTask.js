import React, { useState } from 'react'

import { withStyles, Tooltip } from '@material-ui/core'
import db, { getCurrentUser } from '../../db'

const styles = () =>({

    wrapper:{
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

const EditWeekDayTask = ({day,current,classes}) => {
    const [text, setText] = useState(current.task)

    const handleInput = async (e) => {
        if(e.key === 'Enter'){
            await db.firestore().collection('tasks').doc(getCurrentUser().uid).collection(day).doc(current.uid).update({task: text});
        }
    }
    return  (
        <Tooltip title={text}>
            <input className={classes.wrapper} value={text} onChange={(e) => setText(e.target.value)} onKeyDown={handleInput} />
        </Tooltip>
    )
}

export default withStyles(styles)(EditWeekDayTask)