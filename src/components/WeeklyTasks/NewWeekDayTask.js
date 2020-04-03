import React, { useRef } from 'react'

import { TextField } from '@material-ui/core'
import db, { getCurrentUser } from '../../db'


const NewWeekDayTask = ({day,tasks}) => {
    const inputRef = useRef(null)

    const handleInput = (e) => {
        if(e.key === 'Enter' && inputRef.current.value !== ''){
            const save = db.firestore().collection('tasks').doc(getCurrentUser().uid).collection(day).add({task: inputRef.current.value, complete: false});
            save.then((res)=> { inputRef.current.value = ''}).catch(error=> console.log(error))
        }
    }
    return (
            <TextField style={{marginBottom:16}}  size="small" inputRef={inputRef} label={`New for ${day}...`}  onKeyDown={handleInput} />
    )
}

export default NewWeekDayTask