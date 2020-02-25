import React, { useContext, useState, useEffect } from 'react';
import { StoreContext } from '../context/store';
import { StoreActions } from '../context/reducer';
import { priorities } from './NewTask'

import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Button from '@material-ui/core/Button';
import Fade from '@material-ui/core/Fade';
import TextField from '@material-ui/core/TextField';
import { DropzoneArea } from 'material-ui-dropzone'
import { Slider, Typography } from '@material-ui/core';
import TagsInput from 'react-tagsinput'
import DateTimePicker from 'react-datetime-picker';
import 'react-tagsinput/react-tagsinput.css';
import db from '../db';

const useStyles = makeStyles(theme => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow:'scroll',
    },
    paper: {
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
        maxWidth:'430px'
    },
    form: {
        display: 'grid',
        gridGap: '10px'
    },
    footer: {
        display: 'flex',
        justifyContent: 'flex-end'
    },
    primaryColor:{
        borderColor: '#3f51b5'
    },
    dropZoneArea:{
        minHeight: 180,
        maxWidth: 410,
        overflowY: 'auto'
    },
    dropZoneAreaText:{
        fontSize: 18
    }
}));


const valuetext = ( value ) =>{
    return priorities[value].label;
}

export default function EditTask() {
    const classes = useStyles();
    const { state, dispatch } = useContext(StoreContext);
    const [task, setTask] = useState({});
    const [saving, setsaving] = useState(false)
    const handleClose = () => {
        dispatch({ type: StoreActions.CANCEL_EDIT_TASK })
    };

    useEffect(() => {
        if(state.taskEdit){
            setTask({...state.taskEdit})
        }
    }, [state.taskEdit])

    const handleSave = async () =>{
        setsaving(true)
        const filesUrls = []

        /*
        for (const file of task.files) {
            await db.storage().ref(`${state.user.uid}/${file.name}`).put(file).then(function(fileSnapshot){
                return fileSnapshot.ref.getDownloadURL().then((url) => filesUrls.push(url))
            })
        }
        */
        var data = {...task}
        data.files = [...filesUrls]
        await db.firestore().collection('tasks').doc(state.user.uid).collection('todo').doc(state.taskEdit.uid).update(data)
        dispatch({type: StoreActions.SHOW_NOTIFICATION, data: { notification : 'Task updated!'}})
        setsaving(false)
        handleClose();
    }

    const handleFileChange = async (uploadedFile) =>{
        setTask({...task, files: [...task.files, uploadedFile]})
    }

    const handleFileDelete = (file) =>{
        const list = task.files.filter( x => x !== file)
        setTask({...task, files: list})
    }
    
    return (
        <Modal
            className={classes.modal}
            open={state.editTask}
            onClose={handleClose}
            closeAfterTransition
            BackdropComponent={Backdrop}
            disableBackdropClick
            BackdropProps={{
                timeout: 500,
            }}
        >
            <Fade in={state.editTask}>
                <div className={classes.paper}>
                    <h2 id="transition-modal-title">Edit Task</h2>

                    <form className={classes.form}>
                        <TextField
                            required
                            label="Title"
                            value={task.title}
                            onChange={(e)=>setTask({...task, title:e.target.value})}
                            />
                        <TextField
                            label="Description"
                            multiline
                            rows="2"
                            rowsMax="4"
                            value={task.description}
                            onChange={(e)=>setTask({...task, description:e.target.value})}

                        />

                        {task.dueDate && <>
                        <Typography   gutterBottom>
                            Due date
                        </Typography>
                        <DateTimePicker
                            value={state.taskEdit.dueDate.toDate()}
                            disableClock
                            onChange={(date)=>{ setTask({...task, dueDate:date})}}
                            minDate={new Date()}
                        />
                        </>}

                        <>
                        <Typography  gutterBottom>
                            Priority
                        </Typography>
                        <Slider
                         defaultValue={1}
                         aria-labelledby="discrete-slider"
                         valueLabelDisplay="auto"
                         valueLabelFormat={valuetext}
                         step={1}
                         marks={priorities}
                         min={0}
                         max={4}
                         value={task.priority}
                         onChange={(e,newVal) => setTask({...task, priority: newVal})}
                        />
                        </>
                        <>
                        <Typography  gutterBottom>
                            Links
                        </Typography>
                        <TagsInput 
                        focusedClassName={classes.primaryColor}
                        inputProps={{placeholder: 'Add'}}
                        value={task.links}
                        onlyUnique
                        onChange={(link)=> setTask({...task, links: [...link]})} 
                        />
                        </>
                        <>
                        <Typography  gutterBottom>
                            Files
                        </Typography>
                        <DropzoneArea
                            initialFiles={task.files}
                            useChipsForPreview={true}
                            onDrop={(e) => handleFileChange(e)}
                            onDelete={(e) => handleFileDelete(e)}
                            dropzoneClass={classes.dropZoneArea}
                            dropzoneParagraphClass={classes.dropZoneAreaText}
                            dropzoneText={"Drag and drop a file here or click"}
                         />
                        </>
                        <div className={classes.footer}>
                            <Button variant="contained" color="primary" onClick={handleSave} disabled={saving}>
                                Update
                            </Button>
                        </div>
                    </form>
                </div>
            </Fade>
        </Modal>
    );
}