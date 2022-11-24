import './register.css';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login, loginSelector } from '../../store/reducers/loginReducer/loginSlice';
import { checkPhone } from '../../utils/checkPhoneValid';
import { useAuthContext } from '../../contexts/AuthContext';
import jwt from '../../utils/jwt';
import { apiRegister } from '../../api/apiRegister';
import { apiUser } from '../../api/apiUser';
import Timer from './CountDown';
import { FormControlLabel, Radio, RadioGroup } from "@mui/material";
import CountDown from './CountDown';
import { getProfile, meSelector } from '../../store/reducers/userReducer/meReducer';


const Register = () => {
    const { isAuthenticated } = useAuthContext();
    const char = "!@#$&*%^&().?<>'";
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isLogin } = useSelector(loginSelector);
    const RESEND_OTP_TIME_LIMIT = 60;
    const [otp, setOtp] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [name, setName] = useState('Chưa đặt tên');
    const birthRef = useRef();
    const [birthDayStr, setBirthDayStr] = useState('');
    const [birthDay, setBirthDay] = useState('1999-01-01');
    const [gender, setGender] = useState(Number(0));
    const [step, setStep] = useState('FORM_REGISTER');
    const [checkDis, setDis] = useState(false)
    const SECOUNDS_OTP = 60;
    const check0 = useRef();
    const check1 = useRef();
    const check2 = useRef();
    const check3 = useRef();
    const check4 = useRef();
    const check5 = useRef();
    const check6 = useRef();
    const checkOtp = useRef();
    const checkCountOtp = useRef();
    const checkPass = /^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z]).{8,16}$/;
    let conditional = false;

    // useEffect(() => {
    //     if (jwt.getUserId()) navigate('..');
    // }, [jwt.getUserId()]);

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

    // const name = "Chưa đặt tên"
    const [otpDb, setOtpDB] = useState();
    // const [user, setUser] = useState(null);
    const [checksubmit, setSubmit] = useState(false);
    const [countOtp, setCountOtp] = useState(1);
    const [timeLeft, setTimeLeft] = useState(0);
    // const onLogin = (e) => {
    //     e.preventDefault();
    //     dispatch(login({ username, password }));
    //     if (isLogin) navigate('..');
    // };
    const onSubmit = async (e) => {
        setSubmit(true);
        e.preventDefault();
        if (step === 'FORM_REGISTER') {
            if (conditional) {
                try {
                    const regis = await apiRegister.register({ name, username, password })
                    // console.log("regis", regis.config.data)
                    if (regis.config.data){
                        setStep('FORM_OTP');
                        setTimeLeft(60);
                        setDis(false)
                    }
                } catch (error) {
                    const account = await apiUser.getUserByUserName({ username });
                    console.log("accc", account.data)
                    if (account.data.isActived) {
                        alert(`Số điện thoại ${username} đã được kích hoạt vui lòng đăng ký tài khoản khác`)
                        // navigate("/login")
                    } else {
                        apiRegister.resetOtp({ username });
                        setStep('FORM_OTP');
                        setTimeLeft(60);
                        setDis(false)
                    }
                    console.log("user")
                }

                //  apiRegister.register({name, username, password}).then(res => {
                //     dispatch(
                //     resetOTP({
                //         username: username
                //     }),
                // )  
                //  })
            };
        }
        if (step === 'FORM_OTP') {
            checkOtp.current.className = 'catchError hide';
            try {
                const confirm = await apiRegister.confirm({ username, otp });
                console.log("confirm", confirm)
                    const account = await apiUser.getUserByUserName({ username });
                    console.log("acctive",account.data.isActived )
                    if(account.data.isActived ===true){
                        dispatch(login({ username, password }));
                        setTimeout(async() => {
                        console.log("userrx", jwt.getUserId())
                        console.log("token", jwt.getToken())
                        const user = await apiUser.getProfile();
                        console.log("uu", typeof user.data.birthDay)
                        setStep('FORM_INFO');
                        }, 1500);
                    }   
                 
                
            } catch (error) {
                // apiRegister.resetOtp({ username });
                setCountOtp(countOtp + 1);
                console.log("wrong otp")
                console.log(countOtp)
                checkOtp.current.className = 'catchError error';
                if (countOtp > 3) {
                    checkOtp.current.className = 'catchError hide';
                    checkCountOtp.current.className = 'catchError error';

                    setDis(true)
                }
            }
        }
        if (step === 'FORM_INFO') {
            console.log(`name: ${name} birth: ${birthDay} gender: ${gender}`);
            // console.log("birtREF", birthRef.current.value)
            console.log("type birh", typeof birthDay)
            
            await apiUser.updateProfile({ name, birthDay, gender })

            const us = await apiUser.getProfile();
            console.log("upp", us.data)
            navigate('..');
        }

    };
    useEffect(() => {
        // if (!timeLeft) return;
        const intervalId = setInterval(async () => {
            if (timeLeft === 0) {
                setDis(true)
                // await apiRegister.resetOtp({username});
                // setTimeLeft(60);
            }
            if (timeLeft > 0) {
                setTimeLeft(timeLeft - 1);
                
            }
        }, 1000);
        return () => clearInterval(intervalId);
    }, [timeLeft]);
    const handleResentOTP = async (e) => {
        e.preventDefault();
        setOtp('');
        checkOtp.current.className = 'catchError hide';
        checkCountOtp.current.className = 'catchError hide';
        setDis(false);
        setTimeLeft(60);
        await apiRegister.resetOtp({ username });
        alert(`Mã OTP đã được gửi lại vào số ${username}`)
    }

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
                            <label>Số điện thoại</label>
                            <input
                                value={username}
                                name="username"
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

                        <div className="form-group pt-3 pb-3 zone-error">
                            <p ref={check0} style={{ color: 'red' }} className="catchError hide">
                                {' '}
                                * số điện thoại không tồn tại
                            </p>
                            <p ref={check1} className="catchError">
                                {' '}
                                * số điện thoại chỉ bao gồm số (10 chữ số ex: 0123456789)
                            </p>
                            <p ref={check2} className="catchError">
                                {' '}
                                * mật khẩu có chứa ít nhất 1 ký tự đặc biệt và số `${char}`
                            </p>
                            <p ref={check3} className="catchError">
                                {' '}
                                * mật khẩu có chứa ít nhất 1 ký tự chữ in hoa
                            </p>
                            <p ref={check4} className="catchError">
                                {' '}
                                * mật khẩu có chứa ít nhất 1 ký tự chữ thường
                            </p>
                            <p ref={check5} className="catchError">
                                {' '}
                                * mật khẩu có độ dài từ 8-16 ký tự
                            </p>
                            <p ref={check6} className="catchError">
                                {' '}
                                * xác nhận mật khẩu phải trùng khớp
                            </p>
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
                        {/* <CountDown username={username} secounds={SECOUNDS_OTP} /> */}
                        <h4>{timeLeft}</h4>
                        <div className="form-group mt-3">
                            <label>{`OTTTP:`}</label>
                            <div style={{ display: 'flex' }}>
                                <input
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    type="text"
                                    className="form-control mt-1"
                                    placeholder="OTP gồm 6 chữ số"
                                />
                                <button onClick={handleResentOTP} style={{ height: '38px', marginTop: '4px' }} className="btn btn-primary">
                                    <RestartAltIcon fontSize='medium' />
                                </button>
                            </div>

                        </div>

                        <div className="form-group pt-3 pb-3">
                            <p ref={checkOtp} className="catchError hide"> OTP không chính xác hoặc đã hết hạn</p>
                            <p ref={checkCountOtp} className="catchError hide"> Vượt quá số lần nhập, yêu cầu gửi lại mã</p>
                        </div>

                        <div className="d-grid gap-2 mt-3">
                            <button id='submit' disabled={checkDis} type="submit" className="btn btn-primary">
                                Xác nhận
                            </button>
                        </div>
                        <p className="option-login text-right mt-2">
                            <span>
                                <Link onClick={clickToFormRegiser} to="../register">
                                    Trở lại
                                </Link>
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
                            <label>Tên</label>
                            <input type="text" name='name' onChange={(e) => setName(e.target.value)} className="form-control mt-1" placeholder="Tên người dùng" />
                        </div>

                        <div className="form-group mt-3">
                            <label>Giới tính</label>
                            <RadioGroup
                                style={{ padding: '10px' }}
                                row
                                name="row-radio-buttons-group"
                                value={
                                    gender
                                }

                                onChange={(e) => setGender(Number(e.target.value))}
                            >
                                <div style={{ display: 'flex' }}>
                                    <FormControlLabel value={1} control={<Radio />} label="Nam" />
                                    <FormControlLabel value={0} control={<Radio />} label="Nữ" />
                                </div>
                            </RadioGroup>

                        </div>
                        <div className="form-group mt-3">
                            <label>Ngày sinh</label>
                            <input type="date" name='birthDay'
                                value={birthDay}
                                ref={birthRef} id="birtDay"
                                onChange={(e) => {
                                    const birth = e.target.value;
                                    const date = new Date(birth)
                                    console.log("date change ",typeof birth);
                                    console.log("date change2 ",typeof date);
                                    // const dateCv = Date(date.getFullYear)
                                    setBirthDay(birth);
                                }}
                           
                            
                                className="form-control mt-1" />
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
