import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Button from '@material-ui/core/Button';
import Fade from '@material-ui/core/Fade';
import TextField from '@material-ui/core/TextField';
import { DropzoneArea } from 'material-ui-dropzone'

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
    },
    form: {
        display: 'grid',
        gridGap: '10px'
    },
    footer:{
        display: 'flex',
        justifyContent: 'flex-end'
    }
}));

export default function NewTask({ open, setOpen }) {
    const classes = useStyles();

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <Modal
            className={classes.modal}
            open={open}
            onClose={handleClose}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
                timeout: 500,
            }}
        >
            <Fade in={open}>
                <div className={classes.paper}>
                    <h2 id="transition-modal-title">New Task</h2>

                    <form className={classes.form}>
                        <TextField
                            label="Title" />
                        <TextField
                            label="Description"
                            multiline
                            rows="4"
                            rowsMax="8"
                        />
                        <TextField
                            id="datetime-local"
                            label="Due date"
                            type="datetime-local"
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                        <DropzoneArea
                            useChipsForPreview={true}
                            onChange={() => console.log('kek')}
                        />

                        <div className={classes.footer}>
                            <Button variant="contained" color="primary">
                                Save
                            </Button>
                        </div>
                    </form>
                </div>
            </Fade>
        </Modal>
    );
}