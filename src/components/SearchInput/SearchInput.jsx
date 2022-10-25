import React, { useEffect } from 'react';
import './searchInput.css';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';

import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import GroupAddOutlinedIcon from '@material-ui/icons/GroupAddOutlined';
import PersonAddOutlinedIcon from '@material-ui/icons/PersonAddOutlined';
import { Avatar, Button } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { findFriend, friendSelector, inviteFriend } from '../../store/reducers/friendReducer/friendReducer';
import jwt from '../../utils/jwt';
const useStyles = makeStyles((theme) => ({
    root: {
        padding: '0px 4px',
        display: 'flex',
        alignItems: 'center',
        boxShadow: 'unset',
        flex: 1,
    },

    input: {
        marginLeft: theme.spacing(1),
        flex: 1,
    },
    iconButton: {
        padding: 10,
    },
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    paper: {
        backgroundColor: 'white',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
}));

Fade.propTypes = {
    children: PropTypes.element,
    in: PropTypes.bool.isRequired,
    onEnter: PropTypes.func,
    onExited: PropTypes.func,
};

export default function SearchInput() {
    const classes = useStyles();
    const dispatch = useDispatch();
    const [open, setOpen] = React.useState(false);
    const friend = useSelector(friendSelector);
    const [phone, setPhone] = React.useState('');
    const [result, setResult] = React.useState(null);
    const handleOpen = () => {
        setOpen(true);
        setResult(null);
        setPhone('');
    };

    const handleClose = () => {
        setOpen(false);
    };
    useEffect(() => {
        if (friend) {
            setResult(friend._id !== jwt.getUserId() ? friend : null);
            console.log(friend);
        }
    }, [friend]);

    const onClickToSearch = () => {
        setResult(null);
        if (!phone.length > 0 || !/[0-9]{10}/.test(phone)) return;
        dispatch(findFriend(phone));
    };
    const onClickInvite = (result) => {
        dispatch(inviteFriend(result));
        setResult(null);
    };
    return (
        <>
            <Paper className={classes.root}>
                <IconButton type="submit" className={classes.iconButton} aria-label="search">
                    <SearchIcon fontSize="small" />
                </IconButton>
                <InputBase className={classes.input} placeholder="Tìm kiếm" inputProps={{ 'aria-label': 'search' }} />

                <IconButton type="submit" className={classes.iconButton} onClick={handleOpen} aria-label="add-one">
                    <PersonAddOutlinedIcon fontSize="small" />
                </IconButton>
                <IconButton type="submit" className={classes.iconButton} aria-label="add-group">
                    <GroupAddOutlinedIcon fontSize="small" />
                </IconButton>
            </Paper>
            <Modal
                aria-labelledby="spring-modal-title"
                aria-describedby="spring-modal-description"
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
                    <div className={`${classes.paper} modalAddFriend`}>
                        <div className="modalAddFriendHeader">
                            <p>Thêm bạn</p>
                            <button onClick={handleClose}>&#10005;</button>
                        </div>
                        <div className="modalAddFriendBody">
                            <div className="modalAddFriendInput">
                                <span> +84</span>
                                <input
                                    type="text"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder="Số điện thoại"
                                />
                            </div>
                            <div className="modalAddFriendResult scrollbar" id="style-scroll">
                                <div>
                                    {result && result._id !== jwt.getUserId() && (
                                        <div className="friendItemInvite">
                                            <Avatar style={{ marginLeft: '10px' }} src={result ? result.avatar : ''} />
                                            <div style={{ flex: 1 }}>
                                                <p className="friendItemInfo">{result ? result.username : ''}</p>
                                                <p className="friendItemInfo">{result ? result.name : ''}</p>
                                            </div>
                                            <div>
                                                {}
                                                <Button
                                                    onClick={onClickInvite.bind(this, result)}
                                                    variant="contained"
                                                    color="primary"
                                                >
                                                    kết bạn
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="modalAddFriendFooter">
                            <Button onClick={handleClose} variant="contained">
                                Thoát
                            </Button>
                            <Button variant="contained" onClick={onClickToSearch} color="primary">
                                Tìm kiếm
                            </Button>
                        </div>
                    </div>
                </Fade>
            </Modal>
        </>
    );
}
