import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Avatar from '@material-ui/core/Avatar';
import Collapse from '@material-ui/core/Collapse';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import moment from 'moment'
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { red } from '@material-ui/core/colors';
import EditIcon from '@material-ui/icons/Edit';
import DoneIcon from '@material-ui/icons/Done';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

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
  avatar: {
    backgroundColor: red[500],
  },
}));

const Task = ({todo}) => {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
  return (
    <Card className={classes.root}>
      <CardHeader
        avatar={
        <Avatar aria-label="priority" className={classes.avatar}>
          H
        </Avatar>
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
          <Typography paragraph>Links:</Typography>
          <List component="nav" aria-label="main mailbox folders">
          {todo.links.map((link, index) => <ListItem key={`${link} - ${index}`}>{link} </ListItem>)} 
          </List>
          <Typography paragraph>Files:</Typography>
          {todo.files.map((file, index) => <ListItem button key={`${file} - ${index}`}>{file} </ListItem>)} 
        </CardContent>
      </Collapse>
    </Card>
  );
}

export default Task