import React, { useContext, useState } from 'react'
import moment from 'moment'

import { StoreContext } from '../context/store'
import { StoreActions } from '../context/reducer'
import { makeStyles } from '@material-ui/core/styles'
import Modal from '@material-ui/core/Modal'
import Backdrop from '@material-ui/core/Backdrop'
import Button from '@material-ui/core/Button'
import Fade from '@material-ui/core/Fade'
import TextField from '@material-ui/core/TextField'
import { DropzoneArea } from 'material-ui-dropzone'
import { Slider, Typography } from '@material-ui/core'
import TagsInput from 'react-tagsinput'
import 'react-tagsinput/react-tagsinput.css'
import db from '../db'

const useStyles = makeStyles(theme => ({
  modal: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    overflow: 'scroll'
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
    maxWidth: 410
  },
  dropZoneAreaText: {
    fontSize: 18
  }
}))

export const priorities = [
  {
    value: 0,
    label: 'Low'
  },
  {
    value: 1,
    label: 'Medium'
  },
  {
    value: 2,
    label: 'High'
  },
  {
    value: 3,
    label: 'Urgent'
  },
  {
    value: 4,
    label: 'Critical'
  }
]

const valuetext = value => {
  return priorities[value].label
}

export default function NewTask () {
  const baseTask = {
    title: '',
    description: '',
    dueDate: moment(new Date())
      .set({ hour: 18 })
      .format('YYYY-MM-DDTHH:MM'),
    priority: 1,
    links: [],
    files: [],
    complete: false
  }
  const classes = useStyles()
  const { state, dispatch } = useContext(StoreContext)
  const [task, setTask] = useState(baseTask)
  const [saving, setsaving] = useState(false)

  const handleClose = () => {
    setTask(baseTask)
    dispatch({ type: StoreActions.CANCEL_CREATE_NEW })
  }

  const handleSave = async () => {
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
    data.files = [...filesUrls]
    await db
      .firestore()
      .collection('tasks')
      .doc(state.user.uid)
      .collection('todo')
      .add(data)
    dispatch({
      type: StoreActions.SHOW_NOTIFICATION,
      data: { notification: 'New task created!' }
    })
    setsaving(false)
    handleClose()
  }

  const handleFileChange = async uploadedFile => {
    setTask({ ...task, files: [...task.files, uploadedFile] })
  }

  const handleFileDelete = file => {
    const list = task.files.filter(x => x !== file)
    setTask({ ...task, files: list })
  }

  return (
    <Modal
      className={classes.modal}
      open={state.createNew}
      onClose={handleClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500
      }}
    >
      <Fade in={state.createNew}>
        <div className={classes.paper}>
          <h2 id='transition-modal-title'>New Task</h2>

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

            <TextField
              required
              label='Due Date'
              type='datetime-local'
              value={task.dueDate}
              onChange={e => {
                setTask({ ...task, dueDate: e.target.value })
              }}
              InputLabelProps={{
                shrink: true
              }}
            />

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
            <>
              <Typography gutterBottom>Files</Typography>
              <DropzoneArea
                useChipsForPreview={true}
                onDrop={e => handleFileChange(e)}
                onDelete={e => handleFileDelete(e)}
                dropzoneClass={classes.dropZoneArea}
                dropzoneParagraphClass={classes.dropZoneAreaText}
                dropzoneText={'Add a file'}
              />
            </>
            <div className={classes.footer}>
              <Button
                variant='contained'
                color='primary'
                onClick={handleSave}
                disabled={saving || !task.dueDate}
              >
                Save
              </Button>
            </div>
          </form>
        </div>
      </Fade>
    </Modal>
  )
}
