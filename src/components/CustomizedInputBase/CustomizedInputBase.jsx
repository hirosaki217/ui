import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MoodIcon from '@material-ui/icons/Mood';
import { useDispatch } from 'react-redux';
import { sendMessage } from '../../store/reducers/messageReducer/messageSlice';
const useStyles = makeStyles((theme) => ({
    root: {
        padding: '2px 4px',
        display: 'flex',
        alignItems: 'center',
        boxShadow: 'unset',
        flex: 1,
    },
    input: {
        marginLeft: theme.spacing(1),
        flex: 1,
        fontSize: '15px',
    },
    iconButton: {
        padding: 10,
        fontSize: 17,
    },
    divider: {
        height: 28,
        margin: 4,
    },
}));

export default function CustomizedInputBase({ conversationId, socket }) {
    const classes = useStyles();
    const dispatch = useDispatch();
    const [text, setText] = useState('');
    const onClickToSend = (e) => {
        e.preventDefault();
        dispatch(
            sendMessage({
                content: text,
                conversationId,
                type: 'TEXT',
            }),
        );
        setText('');
    };

    return (
        <Paper onSubmit={onClickToSend} component="form" className={classes.root}>
            <InputBase
                className={classes.input}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Nhập tin nhắn"
                inputProps={{ 'aria-label': 'search google maps' }}
            />

            <IconButton className={classes.iconButton} aria-label="emoji">
                <MoodIcon />
            </IconButton>
            <Divider className={classes.divider} orientation="vertical" />
            <IconButton type="submit" color="primary" className={classes.iconButton} aria-label="send">
                Gửi
            </IconButton>
        </Paper>
    );
}
