import React, { useContext, useState } from 'react';
import { StoreContext } from '../context/store';
import { StoreActions } from '../context/reducer';
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

import 'react-tagsinput/react-tagsinput.css'

const useStyles = makeStyles(theme => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
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
        maxHeight: 200,
        minHeight: 100,
    },
    dropZoneAreaText:{
        fontSize: 18
    }
}));

export const priorities = [
    {
        value: 0,
        label: 'Low',
      },
      {
        value: 1,
        label: 'Medium',
      },
      {
        value: 2,
        label: 'High',
      },
      {
        value: 3,
        label: 'Urgent',
      },
      {
        value: 4,
        label: 'Critical',
      },
];

const valuetext = ( value ) =>{
    return priorities[value].label;
}

export default function NewTask() {
    const baseTask  = {
        title:"",
        description:"",
        dueDate:"",
        priority:1,
        links:[],
        files:[],
        complete: false,
    }
    const classes = useStyles();
    const { state, dispatch } = useContext(StoreContext);
    const [task, setTask] = useState(baseTask)
    const handleClose = () => {
        setTask(baseTask)
        dispatch({ type: StoreActions.CANCEL_CREATE_NEW })
    };

    const handleSave = () =>{
        dispatch({ type: StoreActions.SAVE, data: task })
    }
    return (
        <Modal
            className={classes.modal}
            open={state.createNew}
            onClose={handleClose}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
                timeout: 500,
            }}
        >
            <Fade in={state.createNew}>
                <div className={classes.paper}>
                    <h2 id="transition-modal-title">New Task</h2>

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

                        <>
                        <Typography   gutterBottom>
                            Due date
                        </Typography>
                        <DateTimePicker
                            value={task.dueDate}
                            onChange={(date)=>{ setTask({...task, dueDate:date})}}
                        />
                        </>

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

                        <DropzoneArea
                            useChipsForPreview={true}
                            onChange={() => console.log('kek')}
                            dropzoneClass={classes.dropZoneArea}
                            dropzoneParagraphClass={classes.dropZoneAreaText}
                            dropzoneText={"Drag and drop a file here or click"}
                        />

                        <div className={classes.footer}>
                            <Button variant="contained" color="primary" onClick={handleSave}>
                                Save
                            </Button>
                        </div>
                    </form>
                </div>
            </Fade>
        </Modal>
    );
}