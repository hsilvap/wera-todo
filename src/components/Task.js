import React, {useEffect, useState} from 'react';
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
import EditIcon from '@material-ui/icons/Edit';
import DoneIcon from '@material-ui/icons/Done';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import db from '../db';
import PriorityAvatar from './PriorityAvatar';

const useStyles = makeStyles(theme => ({
  root: {
    maxWidth: 345,
    margin: '20px 20px'
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
}));

const Task = ({todo}) => {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);
  const [downloads, setDownloads] = useState([])
  const isExpired = moment(todo.dueDate.toDate()) < moment(Date.now())
  console.log(isExpired) 
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

  return (
    <Card className={clsx(!isExpired ? classes.root : [classes.root, classes.expired])}>
      <CardHeader
        avatar={
            <PriorityAvatar priority={todo.priority}/>
        }
        action={
          <IconButton aria-label="settings">
            <EditIcon />
          </IconButton>
        }
        title={todo.title}
        subheader={moment(todo.dueDate.toDate()).format('[Complete me before] Do MMMM YYYY, h:mm:ss a')}
      />
      <CardContent>
        <Typography variant="body2" color="textSecondary" component="p">
            {todo.description}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton color="primary" aria-label="Mark complete" >
          <DoneIcon />
        </IconButton>
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
          {todo.links.map((link, index) => <ListItem key={`${link} - ${index}`}>{link} </ListItem>)} 
          </List>
          <Typography paragraph>Files:</Typography>
          {downloads.map((file, index) => <ListItem  component="a" button onClick={()=>handleDownload(file.file)} key={`${file} - ${index}`}>{file.name} </ListItem>)} 
        </CardContent>
      </Collapse>
    </Card>
  );
}

export default Task