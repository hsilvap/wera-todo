import React, { useContext, useState, useEffect } from 'react'
import moment from 'moment'
import { StoreContext } from '../context/store'
import { StoreActions } from '../context/reducer'
import { priorities } from './NewTask'

import { makeStyles } from '@material-ui/core/styles'
import Modal from '@material-ui/core/Modal'
import Backdrop from '@material-ui/core/Backdrop'
import Button from '@material-ui/core/Button'
import Fade from '@material-ui/core/Fade'
import TextField from '@material-ui/core/TextField'
import { DropzoneArea } from 'material-ui-dropzone'
import { Slider, Typography, Chip } from '@material-ui/core'
import TagsInput from 'react-tagsinput'
import 'react-tagsinput/react-tagsinput.css'
import db from '../db'

const useStyles = makeStyles(theme => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    overflowY: 'scroll'
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    maxWidth: '430px'
  },
  form: {
    display: 'grid',
    gridGap: '10px'
  },
  footer: {
    display: 'flex',
    justifyContent: 'flex-end'
  },
  primaryColor: {
    borderColor: '#3f51b5'
  },
  dropZoneArea: {
    minHeight: 100,
    maxWidth: 410,
    overflowY: 'auto'
  },
  dropZoneAreaText: {
    fontSize: 18
  }
}))

const valuetext = value => {
  return priorities[value].label
}

export default function EditTask () {
  const classes = useStyles()
  const { state, dispatch } = useContext(StoreContext)
  const [task, setTask] = useState({})
  const [saving, setsaving] = useState(false)
  const [files, setfiles] = useState([])

  const handleClose = () => {
    dispatch({ type: StoreActions.CANCEL_EDIT_TASK })
  }

  useEffect(() => {
    if (state.taskEdit) {
      let dl = []
      if (state.taskEdit.files) {
        state.taskEdit.files.forEach(file => {
          const name = db.storage().refFromURL(file).name
          dl.push({ name, file })
        })
        setfiles(dl)
      }
      let legacyDate
      if (
        state.taskEdit.dueDate &&
        typeof state.taskEdit.dueDate !== 'string'
      ) {
        legacyDate = moment(state.taskEdit.dueDate.toDate()).format(
          'YYYY-MM-DDTHH:MM:SS'
        )
      }

      setTask({
        ...state.taskEdit,
        dueDate: legacyDate ? legacyDate : state.taskEdit.dueDate,
        initialDueDate: legacyDate ? legacyDate : state.taskEdit.dueDate,
        editedDate: false,
        files: []
      })
    }
  }, [state.taskEdit])

  const handleSave = async () => {
    try {
      setsaving(true)
      const filesUrls = []
      for (const file of task.files) {
        await db
          .storage()
          .ref(`${state.user.uid}/${file.name}`)
          .put(file)
          .then(function (fileSnapshot) {
            return fileSnapshot.ref
              .getDownloadURL()
              .then(url => filesUrls.push(url))
          })
      }
      var data = { ...task }
      var currentfiles = files.map(x => x.file)
      data.files = [...filesUrls, ...currentfiles]
      await db
        .firestore()
        .collection('tasks')
        .doc(state.user.uid)
        .collection('todo')
        .doc(state.taskEdit.uid)
        .update(data)
      dispatch({
        type: StoreActions.SHOW_NOTIFICATION,
        data: { notification: 'Task updated!' }
      })
      setsaving(false)
      handleClose()
    } catch (error) {
      dispatch({
        type: StoreActions.SHOW_NOTIFICATION,
        data: { notification: `Error!: ${error.message}` }
      })
      setsaving(false)
    }
  }

  const handleFileChange = async uploadedFile => {
    setTask({ ...task, files: [...task.files, uploadedFile] })
  }

  const handleFileDelete = file => {
    const list = task.files.filter(x => x !== file)
    setTask({ ...task, files: list })
  }
  const handleRemoveExistingFile = file => {
    const fileList = files.filter(x => x !== file)
    setfiles(fileList)
  }

  return (
    <Modal
      className={classes.modal}
      open={state.editTask}
      onClose={handleClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500
      }}
    >
      <Fade in={state.editTask}>
        <div className={classes.paper}>
          <h2 id='transition-modal-title'>Edit Task</h2>

          <form className={classes.form}>
            <TextField
              required
              label='Title'
              value={task.title}
              onChange={e => setTask({ ...task, title: e.target.value })}
            />
            <TextField
              label='Description'
              multiline
              rows='2'
              rowsMax='4'
              value={task.description}
              onChange={e => setTask({ ...task, description: e.target.value })}
            />

            {task.dueDate && (
              <TextField
                label='Due Date'
                type='datetime-local'
                value={task.editedDate ? task.dueDate : task.initialDueDate}
                onChange={e => {
                  setTask({
                    ...task,
                    dueDate: e.target.value,
                    editedDate: true
                  })
                }}
                InputLabelProps={{
                  shrink: true
                }}
              />
            )
            // <>
            //     <Typography gutterBottom>
            //         Due date
            // </Typography>
            //     <DateTimePicker
            //         value={task.editedDate ? task.dueDate : task.initialDueDate.toDate() }
            //         disableClock
            //         onChange={(date) => {  setTask({ ...task, dueDate: date, editedDate: true }) }}
            //         minDate={new Date()}
            //     />
            // </>
            }

            <>
              <Typography gutterBottom>Priority</Typography>
              <Slider
                defaultValue={1}
                aria-labelledby='discrete-slider'
                valueLabelDisplay='auto'
                valueLabelFormat={valuetext}
                step={1}
                marks={priorities}
                min={0}
                max={4}
                value={task.priority}
                onChange={(e, newVal) => setTask({ ...task, priority: newVal })}
              />
            </>
            <>
              <Typography gutterBottom>Links</Typography>
              <TagsInput
                focusedClassName={classes.primaryColor}
                inputProps={{ placeholder: 'Add' }}
                value={task.links}
                onlyUnique
                onChange={link => setTask({ ...task, links: [...link] })}
              />
            </>
            {task.files && (
              <>
                <Typography gutterBottom>Current Files</Typography>
                <div style={{ display: 'flex' }}>
                  {files.map(file => (
                    <Chip
                      style={{ margin: '0px 5px' }}
                      title={file.name}
                      key={file.file}
                      onDelete={() => handleRemoveExistingFile(file)}
                      label={file.name}
                    />
                  ))}
                </div>
              </>
            )}
            <>
              <Typography gutterBottom>Add Files</Typography>
              <DropzoneArea
                useChipsForPreview={true}
                onDrop={e => handleFileChange(e)}
                onDelete={e => handleFileDelete(e)}
                dropzoneClass={classes.dropZoneArea}
                dropzoneParagraphClass={classes.dropZoneAreaText}
                dropzoneText={'Drag and drop a file here or click'}
              />
            </>
            <div className={classes.footer}>
              <Button
                variant='contained'
                color='primary'
                onClick={handleSave}
                disabled={saving}
              >
                Update
              </Button>
            </div>
          </form>
        </div>
      </Fade>
    </Modal>
  )
}
