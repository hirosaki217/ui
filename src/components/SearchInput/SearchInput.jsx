import React from 'react';
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
import { Button } from '@material-ui/core';
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
    const [open, setOpen] = React.useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
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
                                <input type="text" placeholder="Số điện thoại" />
                            </div>
                            <div className="modalAddFriendResult scrollbar" id="style-scroll"></div>
                        </div>
                        <div className="modalAddFriendFooter">
                            <Button onClick={handleClose} variant="contained">
                                Thoát
                            </Button>
                            <Button variant="contained" color="primary">
                                Tìm kiếm
                            </Button>
                        </div>
                    </div>
                </Fade>
            </Modal>
        </>
    );
}
