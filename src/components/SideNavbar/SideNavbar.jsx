import { Avatar, Tooltip, tooltipClasses } from '@mui/material';
import './sideNavbar.css';
import styled from 'styled-components';
import ChatRoundedIcon from '@material-ui/icons/ChatRounded';
import PermContactCalendarOutlinedIcon from '@material-ui/icons/PermContactCalendarOutlined';
import SettingsOutlinedIcon from '@material-ui/icons/SettingsOutlined';
// import { userSelector } from '../../store/reducers/userReducer/userSlice';
const SideNavbar = () => {
    // const user = userSelector(userSelector);
    // console.log(user === undefined);
    return (
        <div className="sideNavbar">
            <div style={{ padding: '25px 0' }}>
                <LightTooltip placement="right">
                    <Avatar
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
                <LightTooltip placement="right" title="cài đặt">
                    <SettingsOutlinedIcon className="icon" />
                </LightTooltip>
            </div>
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
