import React, { useState } from 'react'

import { TextField } from '@material-ui/core'
import db, { getCurrentUser } from '../../db'


const NewWeekDayTask = ({day,tasks}) => {
    const [text, setText] = useState('')

    const handleInput = (e) => {
        if(e.key === 'Enter'){
            const save = db.firestore().collection('tasks').doc(getCurrentUser().uid).collection(day).add({task: text, complete: false});
            save.then((res)=> { setText('')}).catch(error=> console.log(error))
        }
    }
    return (
            <TextField label={`New for ${day}...`} value={text} onChange={(e) => setText(e.target.value)} onKeyDown={handleInput} />
    )
}

export default NewWeekDayTask