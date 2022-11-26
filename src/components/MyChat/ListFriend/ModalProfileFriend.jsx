import { Avatar, Backdrop, Button, Fade, makeStyles, Modal } from "@material-ui/core";
import DeleteIcon from '@mui/icons-material/Delete';
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { listFriendSelector } from "../../../store/reducers/friendReducer/friendReducer";

import { meSelector } from "../../../store/reducers/userReducer/meReducer"
import '../../SideNavbar/ModalProfile/modalProfile.css';
const useStyles = makeStyles((theme) => ({
    paper: {
        width: '350px',
        height: '600px',
        backgroundColor: theme.palette.background.paper,
        border: 'none',
        borderRadius: '5px',
        boxShadow: theme.shadows[5],

    },
}));
const ButtonAddOrDeleteFriend = (props) => {
    const listFriend = useSelector(listFriendSelector);
    const profile = props.profile
    console.log(listFriend.length)

    const check = listFriend.some((friend) => {
        console.log("profile", profile.username)
        console.log("friend", friend.username)
        if (friend.username === profile.username)
            return true;
        return false;
    })
    if (check)
        return (
            <Button style={{ backgroundColor: '#f32c2c', color: 'white' }} fullWidth={true} >
                <DeleteIcon /> Hủy kết bạn
            </Button>
        )
    return (
        <Button style={{ backgroundColor: '#2c75f3', color: 'white' }} fullWidth={true} >
            Kết bạn
        </Button>
        )
}
const ModalProfileFriend = (props) => {

    const profileUser = props.friend;
    const listFriend = useSelector(listFriendSelector);
    const [listF, setListF] = useState();
    const [name, setName] = useState();
    const [birthDay, setBirthDay] = useState();
    const [gender, setGender] = useState();
    const openProfile = props.openProfilee;
    const classes = useStyles();
    // useEffect(() => {
    //     if (listFriend) setListF(listFriend);
    // }, [listFriend]);
    return (
        <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            className='modal-profile'
            open={openProfile}
            onClose={props.closeProfile}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
                timeout: 500,
            }}

        >
            <Fade in={openProfile}>
                {profileUser &&
                    <div className={classes.paper}>


                        <div className='profile-bao'>
                            <div>
                                <h6>Thông tin tài khoản</h6>
                            </div>
                            <div>
                                <button className="btn-close" onClick={props.closeProfile}></button>
                            </div>

                        </div>
                        <div className='profile-cover'>
                            <img src='https://cover-talk.zadn.vn/default' alt="" />
                        </div>
                        <div className='profile-avatar'>
                            <Avatar
                                style={{ width: '70px', height: '70px', border: '2px solid white' }}
                                src={profileUser.avatar ? profileUser.avatar : ""}>
                                {profileUser.avatar ? "" : profileUser.name[0].toUpperCase()}
                            </Avatar>
                        </div>
                        <div className='profile-info-bao'>
                            <h5 >{name ? name : profileUser.name}</h5>
                            <h6 >Thông tin cá nhân</h6>
                            <div style={{ display: 'flex' }}>
                                <div className='info-left'>
                                    <p >Điện thoại</p>
                                    <p >Giới tính</p>
                                    <p>Ngày sinh</p>
                                </div>

                                <div className='info-right'>
                                    {/* <p>{profileUser.username}</p> */}
                                    <p>***********</p>
                                    <p>
                                        {

                                            profileUser.gender ? "Nam" : "Nữ"

                                        }</p>
                                    <p>
                                        **/**/****
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="btn-go-update">
                            <ButtonAddOrDeleteFriend profile={profileUser} />
                            <Button style={{ backgroundColor: '#E5E7EB' }} fullWidth={true}>
                                Nhắn tin
                            </Button>

                        </div>
                    </div>
                }

            </Fade>
        </Modal>
    )
}
export default ModalProfileFriend;