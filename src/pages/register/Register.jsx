import './register.css';
import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login, loginSelector } from '../../store/reducers/loginReducer/loginSlice';
import { checkPhone } from '../../utils/checkPhoneValid';
import { useAuthContext } from '../../contexts/AuthContext';
import jwt from '../../utils/jwt';

const Register = () => {
    const { isAuthenticated } = useAuthContext();

    const char = "!@#$&*%^&().?<>'";
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isLogin } = useSelector(loginSelector);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState('FORM_REGISTER');
    const check0 = useRef();
    const check1 = useRef();
    const check2 = useRef();
    const check3 = useRef();
    const check4 = useRef();
    const check5 = useRef();
    const check6 = useRef();
    const checkPass = /^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z]).{8,16}$/;
    let conditional = false;

    useEffect(() => {
        if (jwt.getUserId()) navigate('..');
    }, [jwt.getUserId()]);

    useEffect(() => {
        check0.current.className = 'catchError hide';
        if (!/^(0[3|5|7|8|9])+([0-9]{8})\b/.test(username)) {
            check1.current.className = 'catchError error';
            conditional = false;
        } else {
            check1.current.className = 'catchError active';
            conditional = true;
        }

        if (!/^(?=.*[!@#$&*%^&().?<>'])(?=.*[0-9]).{1,}$/.test(password)) {
            check2.current.className = 'catchError error';
            conditional = false;
        } else {
            check2.current.className = 'catchError active';
            conditional = true;
        }

        if (!/^(?=.*[A-Z]).{1,}$/.test(password)) {
            check3.current.className = 'catchError error';
            conditional = false;
        } else {
            check3.current.className = 'catchError active';
            conditional = true;
        }
        if (!/^(?=.*[a-z]).{1,}$/.test(password)) {
            check4.current.className = 'catchError error';
            conditional = false;
        } else {
            check4.current.className = 'catchError active';
            conditional = true;
        }

        if (!/.{8,16}$/.test(password)) {
            check5.current.className = 'catchError error';
            conditional = false;
        } else {
            check5.current.className = 'catchError active';
            conditional = true;
        }

        if (!(password === confirmPassword) || password === '') {
            check6.current.className = 'catchError error';
            conditional = false;
        } else {
            check6.current.className = 'catchError active';
            conditional = true;
        }
    }, [username, password, confirmPassword]);

    const onSubmit = (e) => {
        e.preventDefault();
        if (step === 'FORM_REGISTER') {
            if (conditional) setStep('FORM_OTP');
            // if (checkPhone('+84' + username)) setStep('FORM_OTP');
            // else check0.current.className = 'catchError';
        }
        if (step === 'FORM_OTP') setStep('FORM_INFO');
        if (step === 'FORM_INFO') {
            navigate('..');
        }
    };

    const clickToFormLogin = (e) => {
        e.preventDefault();
        dispatch(login({ isLogin: false, isRegister: false }));
        navigate('../login');
    };

    const clickToFormRegiser = (e) => {
        e.preventDefault();
        setStep('FORM_REGISTER');
    };
    return (
        <div className="Auth-form-container loginContainer ">
            {step === 'FORM_REGISTER' && (
                <form className="Auth-form" onSubmit={onSubmit}>
                    <div className="Auth-form-content">
                        <h3 className="Auth-form-title">Olaz</h3>
                        <div className="form-group mt-3">
                            <label>S???? ??i????n thoa??i</label>
                            <input
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                type="text"
                                className="form-control mt-1"
                                placeholder="Enter phone number"
                            />
                        </div>
                        <div className="form-group mt-3">
                            <label>M????t kh????u</label>
                            <input
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                type="password"
                                className="form-control mt-1"
                                placeholder="Enter password"
                            />
                        </div>
                        <div className="form-group mt-3">
                            <label>Xa??c nh????n la??i m????t kh????u</label>
                            <input
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                type="password"
                                className="form-control mt-1"
                                placeholder="Confirm password"
                            />
                        </div>

                        <div className="form-group pt-3 pb-3 zone-error">
                            <p ref={check0} style={{ color: 'red' }} className="catchError hide">
                                {' '}
                                * s???? ??i????n thoa??i kh??ng t????n ta??i
                            </p>
                            <p ref={check1} className="catchError">
                                {' '}
                                * s???? ??i????n thoa??i chi?? bao g????m s???? (10 ch???? s???? ex: 0123456789)
                            </p>
                            <p ref={check2} className="catchError">
                                {' '}
                                * m????t kh????u co?? ch????a i??t nh????t 1 ky?? t???? ??????c bi????t va?? s???? `${char}`
                            </p>
                            <p ref={check3} className="catchError">
                                {' '}
                                * m????t kh????u co?? ch????a i??t nh????t 1 ky?? t???? ch???? in hoa
                            </p>
                            <p ref={check4} className="catchError">
                                {' '}
                                * m????t kh????u co?? ch????a i??t nh????t 1 ky?? t???? ch???? th??????ng
                            </p>
                            <p ref={check5} className="catchError">
                                {' '}
                                * m????t kh????u co?? ?????? da??i t???? 8-16 ky?? t????
                            </p>
                            <p ref={check6} className="catchError">
                                {' '}
                                * xa??c nh????n m????t kh????u pha??i tru??ng kh????p
                            </p>
                        </div>

                        <div className="d-grid gap-2 mt-3">
                            <button type="submit" className="btn btn-primary">
                                Submit
                            </button>
                        </div>
                        <p className="option-login text-right mt-2">
                            <span>
                                <a href="fb.com">Qu??n m????t kh????u</a>
                            </span>
                            <span>
                                <Link onClick={clickToFormLogin} to="../login">
                                    ??a?? co?? ta??i khoa??n ?
                                </Link>
                            </span>
                        </p>
                    </div>
                </form>
            )}
            {step === 'FORM_OTP' && (
                <form className="Auth-form" onSubmit={onSubmit}>
                    <div className="Auth-form-content">
                        <h4 className="">Xa??c nh????n OTP</h4>
                        <div className="form-group mt-3">
                            <label>OTP</label>
                            <input
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                type="text"
                                className="form-control mt-1"
                                placeholder="OTP g????m 6 ch???? s????"
                            />
                        </div>

                        <div className="form-group pt-3 pb-3">
                            <p className="catchError"> 'icon' OTP kh??ng chi??nh xa??c</p>
                        </div>

                        <div className="d-grid gap-2 mt-3">
                            <button type="submit" className="btn btn-primary">
                                Xa??c nh????n
                            </button>
                        </div>
                        <p className="option-login text-right mt-2">
                            <span>
                                <Link onClick={clickToFormRegiser} to="../register">
                                    Tr???? la??i
                                </Link>
                            </span>
                        </p>
                    </div>
                </form>
            )}
            {step === 'FORM_INFO' && (
                <form className="Auth-form" onSubmit={onSubmit}>
                    <div className="Auth-form-content">
                        <h4 className="">xa??c nh????n th??ng tin ta??i khoa??n</h4>
                        <div className="form-group mt-3">
                            <label>OTP</label>
                            <input type="text" className="form-control mt-1" placeholder="T??n ng??????i du??ng" />
                        </div>

                        <div className="form-group pt-3 pb-3">
                            <p className="catchError"> 'icon' OTP kh??ng chi??nh xa??c</p>
                        </div>

                        <div className="d-grid gap-2 mt-3">
                            <button type="submit" className="btn btn-primary">
                                L??u
                            </button>
                        </div>
                        <p className="option-login text-right mt-2">
                            {/* <span>
                                <Link to="../login">Tr???? la??i</Link>
                            </span> */}
                        </p>
                    </div>
                </form>
            )}
        </div>
    );
};

export default Register;
