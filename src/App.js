import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Outlet, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { loginSelector } from './store/reducers/loginReducer/loginSlice';

function App() {
    const { isLogin, isRegister } = useSelector(loginSelector);

    const navigate = useNavigate();
    useEffect(() => {
        if (!isLogin && !isRegister) {
            navigate('login');
        } else if (!isLogin && isRegister) {
            navigate('register');
        } else {
            navigate('chat');
        }
    }, [isLogin, navigate, isRegister]);
    return (
        <div className="App">
            <Outlet />
        </div>
    );
}

export default App;
