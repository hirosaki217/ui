import './register.css';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../../store/reducers/loginReducer/loginSlice';

const Register = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState('FORM_REGISTER');
    const onSubmit = (e) => {
        e.preventDefault();
        if (step === 'FORM_REGISTER') setStep('FORM_OTP');
        if (step === 'FORM_OTP') setStep('FORM_INFO');
        if (step === 'FORM_INFO') {
            navigate('..');
        }
    };

    const clickToFormLogin = (e) => {
        e.preventDefault();
        dispatch(login({ isLogin: false, isRegister: false }));
        navigate('..');
    };
    return (
        <div className="Auth-form-container loginContainer ">
            {step === 'FORM_REGISTER' && (
                <form className="Auth-form" onSubmit={onSubmit}>
                    <div className="Auth-form-content">
                        <h3 className="Auth-form-title">Olaz</h3>
                        <div className="form-group mt-3">
                            <label>Số điện thoại</label>
                            <input
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                type="text"
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
                        <div className="form-group mt-3">
                            <label>Xác nhận lại mật khẩu</label>
                            <input
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                type="password"
                                className="form-control mt-1"
                                placeholder="Confirm password"
                            />
                        </div>

                        <div className="form-group pt-3 pb-3">
                            <p className="catchError"> 'icon' số điện thoại chỉ bao gồm số</p>
                            <p className="catchError"> 'icon' mật khẩu có chứa ít nhất 1 ký tự đặc biệt </p>
                            <p className="catchError"> 'icon' mật khẩu có chứa ít nhất 1 ký tự chữ in hoa</p>
                            <p className="catchError"> 'icon' mật khẩu có chứa ít nhất 1 ký tự chữ thường</p>
                            <p className="catchError"> 'icon' mật khẩu có độ dài từ 8-16 ký tự</p>
                            <p className="catchError"> 'icon' xác nhận mật khẩu phải trùng khớp</p>
                        </div>

                        <div className="d-grid gap-2 mt-3">
                            <button type="submit" className="btn btn-primary">
                                Submit
                            </button>
                        </div>
                        <p className="option-login text-right mt-2">
                            <span>
                                <a href="fb.com">Quên mật khẩu</a>
                            </span>
                            <span>
                                <Link onClick={clickToFormLogin} to="../login">
                                    Đã có tài khoản ?
                                </Link>
                            </span>
                        </p>
                    </div>
                </form>
            )}
            {step === 'FORM_OTP' && (
                <form className="Auth-form" onSubmit={onSubmit}>
                    <div className="Auth-form-content">
                        <h4 className="">Xác nhận OTP</h4>
                        <div className="form-group mt-3">
                            <label>OTP</label>
                            <input
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                type="text"
                                className="form-control mt-1"
                                placeholder="OTP gồm 6 chữ số"
                            />
                        </div>

                        <div className="form-group pt-3 pb-3">
                            <p className="catchError"> 'icon' OTP không chính xác</p>
                        </div>

                        <div className="d-grid gap-2 mt-3">
                            <button type="submit" className="btn btn-primary">
                                Xác nhận
                            </button>
                        </div>
                        <p className="option-login text-right mt-2">
                            <span>
                                <Link to="../login">Trở lại</Link>
                            </span>
                        </p>
                    </div>
                </form>
            )}
            {step === 'FORM_INFO' && (
                <form className="Auth-form" onSubmit={onSubmit}>
                    <div className="Auth-form-content">
                        <h4 className="">xác nhận thông tin tài khoản</h4>
                        <div className="form-group mt-3">
                            <label>OTP</label>
                            <input type="text" className="form-control mt-1" placeholder="Tên người dùng" />
                        </div>

                        <div className="form-group pt-3 pb-3">
                            <p className="catchError"> 'icon' OTP không chính xác</p>
                        </div>

                        <div className="d-grid gap-2 mt-3">
                            <button type="submit" className="btn btn-primary">
                                Lưu
                            </button>
                        </div>
                        <p className="option-login text-right mt-2">
                            {/* <span>
                                <Link to="../login">Trở lại</Link>
                            </span> */}
                        </p>
                    </div>
                </form>
            )}
        </div>
    );
};

export default Register;
