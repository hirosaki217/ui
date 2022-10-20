import './login.css';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { isRegister } from '../../store/reducers/loginReducer/loginSlice';

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const clickToFormRegister = (e) => {
        e.preventDefault();
        dispatch(isRegister(true));
        navigate('..');
    };
    return (
        <div className="Auth-form-container loginContainer ">
            <form className="Auth-form">
                <div className="Auth-form-content">
                    <h3 className="Auth-form-title">Olaz</h3>
                    <div className="form-group mt-3">
                        <label>Số điện thoại</label>
                        <input
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            type="email"
                            className="form-control mt-1"
                            placeholder="Enter phone number"
                        />
                    </div>
                    <div className="form-group mt-3">
                        <label>Mật khẩu</label>
                        <input
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            type="password"
                            className="form-control mt-1"
                            placeholder="Enter password"
                        />
                    </div>

                    <div className="d-grid gap-2 mt-3">
                        <button type="submit" className="btn btn-primary">
                            Submit
                        </button>
                    </div>
                    <p className="option-login text-right mt-2">
                        <span>
                            <Link to="forgot-password">Quên mật khẩu?</Link>
                        </span>
                        <span>
                            <Link onClick={clickToFormRegister} to="../register">
                                Tạo tài khoản mới?
                            </Link>
                        </span>
                    </p>
                </div>
            </form>
            )
        </div>
    );
};

export default Login;
