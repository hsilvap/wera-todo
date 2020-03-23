import React, {useEffect, useState , useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import moment from 'moment'
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { blueGrey } from '@material-ui/core/colors';
import { red } from '@material-ui/core/colors';
import EditIcon from '@material-ui/icons/Edit';
import DoneIcon from '@material-ui/icons/Done';
import DirectionsRunIcon from '@material-ui/icons/DirectionsRun';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { StoreActions } from '../context/reducer';
import { StoreContext } from '../context/store';

import db from '../db';
import PriorityAvatar from './PriorityAvatar';

const useStyles = makeStyles(theme => ({
  root: {
    maxWidth: 345,
    margin: '5px 5px'
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  expired: {
    backgroundColor: blueGrey[100],
  },
  expiredLabel: {
    color: red[500],
  },
}));

const Task = ({todo, userUid}) => {
  const classes = useStyles();
  const { dispatch, state } = useContext(StoreContext);
  const [expanded, setExpanded] = React.useState(false);
  const [downloads, setDownloads] = useState([])
  const isExpired = moment(todo.dueDate.toDate()) < moment(Date.now())
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  useEffect(() => {
    let dl = []
    todo.files.forEach(file => {
        const name = db.storage().refFromURL(file).name
        dl.push({name, file})
    });
    setDownloads(dl);
  }, [todo.files])

  const handleDownload = (file) =>{
    window.open(file)
  }

  const handleEditTask = () =>{
    dispatch({type: StoreActions.EDIT_TASK, data: { todo, userUid}})
  }

  const handleMarkComplete = (uid) => {
    db.firestore().collection('tasks').doc(userUid).collection('todo').doc(uid).update({complete:true})
    dispatch({type: StoreActions.SHOW_NOTIFICATION, data: { notification : 'Task completed!'}})

  }

  const handleReOpen = (uid) => {
    db.firestore().collection('tasks').doc(userUid).collection('todo').doc(uid).update({complete:false})
    dispatch({type: StoreActions.SHOW_NOTIFICATION, data: { notification : 'Task re-opened!'}})
  }

  return (
    <Card className={clsx(!isExpired ? classes.root : [classes.root, classes.expired])}>
      <CardHeader
        avatar={
            <PriorityAvatar priority={todo.priority}/>
        }
        action={
          !state.showCompleted &&  <IconButton onClick={()=> handleEditTask()} aria-label="settings">
            <EditIcon />
          </IconButton>
        }
        title={todo.title}
        subheader={<span className={clsx(isExpired ? classes.expiredLabel : '')}> { isExpired ? moment(todo.dueDate.toDate()).format('[EXPIRED - due date] Do MMMM YYYY, h:mm:ss a') :moment(todo.dueDate.toDate()).format('[Complete me before] Do MMMM YYYY, h:mm:ss a')} </span>}
      />
      <CardContent>
        <Typography variant="body2" color="textSecondary" component="p">
            {todo.description}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        { !state.showCompleted ? <IconButton onClick={()=> handleMarkComplete(todo.uid)} color="primary" aria-label="Mark complete" >
          <DoneIcon />
        </IconButton>
        :
        <IconButton onClick={()=> handleReOpen(todo.uid)} color="primary" aria-label="Re-open" >
          <DirectionsRunIcon />
        </IconButton>
        
        }
        <IconButton
          className={clsx(classes.expand, {
            [classes.expandOpen]: expanded,
          })}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </IconButton>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography paragraph>Reference links:</Typography>
          <List component="nav" aria-label="main mailbox folders">
          {todo.links.map((link, index) => <ListItem component="a" button target="_blank" rel={"noreferrer"} href={link} key={`${link} - ${index}`}> {link} </ListItem>)} 
          </List>
          <Typography paragraph>Files:</Typography>
          {downloads.map((file, index) => <ListItem  component="a" button onClick={()=>handleDownload(file.file)} key={`${file} - ${index}`}>{file.name} </ListItem>)} 
        </CardContent>
      </Collapse>
    </Card>
  );
}

export default Task