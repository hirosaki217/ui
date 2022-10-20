import { Outlet, Route, Routes, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { useEffect } from 'react';
import { checkAuth, login, loginSelector } from './store/reducers/loginReducer/loginSlice';
import { useDispatch, useSelector } from 'react-redux';
import Login from './pages/login/Login';
import Home from './pages/Home';
import Register from './pages/register/Register';

function App() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    useEffect(() => {
        dispatch(checkAuth());
        if (!Boolean(localStorage.getItem('isLogin') === 'true')) navigate('login');
    }, []);
    return (
        <div className="App">
            <Routes>
                <Route path="/" element={<Home />}></Route>
                <Route path="login" element={<Login />}></Route>
                <Route path="register" element={<Register />}></Route>
            </Routes>
        </div>
    );
}

export default App;
