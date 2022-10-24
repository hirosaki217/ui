import './listConversation.css';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
// import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import React, { useEffect } from 'react';
// import { AvatarGroup } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import {
    conversationSelector,
    getList,
    setCurrentConversation,
} from '../../../store/reducers/conversationReducer/conversationSlice';
import { loginSelector } from '../../../store/reducers/loginReducer/loginSlice';
import { getMessages } from '../../../store/reducers/messageReducer/messageSlice';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        backgroundColor: theme.palette.background.paper,
    },
    inline: {
        display: 'inline',
    },
    listItem: {
        cursor: 'pointer',
        '&:hover': {
            backgroundColor: '#eee;',
        },
    },
}));
const ListConversation = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const conversations = useSelector(conversationSelector);
    const user = useSelector(loginSelector);

    const onSelectConversation = (conversation) => {
        dispatch(setCurrentConversation(conversation));
        dispatch(getMessages(conversation._id));
    };
    return (
        <List className={classes.root}>
            {/*<ListItem className={classes.listItem} alignItems="flex-start">
                 <ListItemAvatar className="listAvatar">
                    <AvatarGroup className="group" total={5}>
                        <Avatar className="iconAvatar" alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
                        <Avatar className="iconAvatar" alt="Travis Howard" src="/static/images/avatar/2.jpg" />
                        <Avatar className="iconAvatar" alt="Agnes Walker" src="/static/images/avatar/4.jpg" />
                    </AvatarGroup>
                </ListItemAvatar>
                <ListItemText
                    primary="Brunch this weekend?"
                    secondary={
                        <React.Fragment>
                            <Typography component="span" variant="body2" className={classes.inline} color="textPrimary">
                                Ali Connors
                            </Typography>
                            {" — I'll be in your neighborhood doing errands this…"}
                        </React.Fragment>
                    }
                />
            </ListItem>
            <Divider variant="inset" component="li" />
            <ListItem className={classes.listItem} alignItems="flex-start">
                <ListItemAvatar>
                    <Avatar alt="Travis Howard" src="/static/images/avatar/2.jpg" />
                </ListItemAvatar>
                <ListItemText
                    primary="Summer BBQ"
                    secondary={
                        <React.Fragment>
                            <Typography component="span" variant="body2" className={classes.inline} color="textPrimary">
                                to Scott, Alex, Jennifer
                            </Typography>
                            {" — Wish I could come, but I'm out of town this…"}
                        </React.Fragment>
                    }
                />
            </ListItem> */}
            {conversations &&
                conversations.map((conversation) => (
                    <ListItem
                        onClick={onSelectConversation.bind(this, conversation)}
                        key={conversation._id}
                        className={classes.listItem}
                        alignItems="flex-start"
                    >
                        <ListItemAvatar>
                            <Avatar alt="Cindy Baker" src={conversation.avatar ? conversation.avatar : ''} />
                        </ListItemAvatar>
                        <ListItemText
                            primary={conversation.name}
                            className="textContent"
                            secondary={
                                <React.Fragment>
                                    <Typography
                                        component="span"
                                        variant="body2"
                                        className={classes.inline}
                                        color="textPrimary"
                                    >
                                        {conversation.lastMessage.user.name}
                                    </Typography>
                                    {' - ' + conversation.lastMessage.content}
                                </React.Fragment>
                            }
                        />
                    </ListItem>
                ))}
        </List>
    );
};

export default ListConversation;
