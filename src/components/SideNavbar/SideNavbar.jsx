import { Avatar, Tooltip, tooltipClasses } from '@mui/material';
import './sideNavbar.css';
import styled from 'styled-components';
import ChatRoundedIcon from '@material-ui/icons/ChatRounded';
import PermContactCalendarOutlinedIcon from '@material-ui/icons/PermContactCalendarOutlined';
import SettingsOutlinedIcon from '@material-ui/icons/SettingsOutlined';
import React from 'react';
import { Menu, MenuItem } from '@material-ui/core';
// import { userSelector } from '../../store/reducers/userReducer/userSlice';
const SideNavbar = () => {
    // const user = userSelector(userSelector);
    // console.log(user === undefined);

    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };
    return (
        <div className="sideNavbar">
            <div style={{ padding: '25px 0' }}>
                <LightTooltip placement="right">
                    <Avatar
                        onClick={handleClick}
                        // style={!user.avatar && { color: `${user.avatarColor}` }}
                        // src={user?.avatar ? user.avatar : ''}
                    />
                </LightTooltip>
            </div>
            <div className="mid-icon">
                <LightTooltip placement="right" title="tin nhắn">
                    <ChatRoundedIcon className="icon active" />
                </LightTooltip>

                <LightTooltip placement="right" title="danh bạ">
                    <PermContactCalendarOutlinedIcon className="icon" />
                </LightTooltip>
            </div>
            <div className="bottom-icon">
                <LightTooltip placement="right" title="cài đặt" onClick={handleClick}>
                    <SettingsOutlinedIcon className="icon" />
                </LightTooltip>
            </div>
            <Menu id="simple-menu" anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
                <MenuItem onClick={handleClose}>Profile</MenuItem>
                <MenuItem onClick={handleClose}>My account</MenuItem>
                <MenuItem onClick={handleClose}>Logout</MenuItem>
            </Menu>
        </div>
    );
};
export const LightTooltip = styled(({ className, ...props }) => <Tooltip {...props} classes={{ popper: className }} />)(
    ({ theme }) => ({
        [`& .${tooltipClasses.tooltip}`]: {
            backgroundColor: 'black',
            color: 'white',
            fontSize: 13,
        },
    }),
);
export default SideNavbar;
