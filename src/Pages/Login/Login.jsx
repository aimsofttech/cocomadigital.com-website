
import './Login.css';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { setUser } from '../../Service/redux/meSlice';


const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector((state) => state.me.user);

    if (user === "admin") {
      return <Navigate to="/" replace />;
    }

    const loginHandler = (event) => {
        event.preventDefault();
        if (email === "admin@cocoma.com" && password === "123456") {
            navigate("/");
            localStorage.setItem("user", "admin");
            dispatch(setUser("admin"));
            toast.success('Login successfully!');
        } else {
            toast.error('Invalid credential!');
        }
    }

    return (
        <div className="login-container">
            <div className="login-box">
                <h2 className="login-title">Login for Admin</h2>
                <form className="login-form" onSubmit={loginHandler}>
                    <input
                        type="email"
                        required
                        placeholder="Email"
                        className="login-input"
                        onChange={(event) => setEmail(event?.target?.value)}
                    />
                    <input
                        type="password"
                        required placeholder="Password"
                        className="login-input"
                        onChange={(event) => setPassword(event?.target?.value)}
                    />
                    <button type="submit" className="login-button">Login</button>
                </form>
            </div>
        </div>
    );
};

export default Login;
