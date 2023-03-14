import React, { useReducer, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import '../assets/css/login.css'
import initialState from './InitialState'
import { reducer } from './Reducer'
import { useValidation } from "./Validation";

const Login = () => {
    const { newSuccess, newErrors, validateType } = useValidation()
    const [state, dispatch] = useReducer(reducer, initialState)
    const [registeredUser, setRegisteredUser] = useState({
        email: "",
        password: ""
    });

    const navigate = useNavigate()

    useEffect(() => {
        dispatch({ type: 'setError', payload: newErrors })
        dispatch({ type: 'setSuccess', payload: newSuccess })
    }, [newErrors, newSuccess]);

    const submitHandler = e => {
        e.preventDefault()
        const type = validateType('Login');
        const { valid } = type.validateLoginForm(registeredUser.email, registeredUser.password);
        if (valid) {
            const foundUser = state.users.find(user => user.email === registeredUser.email)
            if (foundUser) {
                foundUser.isLogin = true
                dispatch({ type: 'loginUser', payload: foundUser })
                alert("Ready to Login");
                navigate('/loginsuccess')
                window.location.reload()
                localStorage.setItem("loggedIn", JSON.stringify(foundUser));
            }
        }
    }

    return (
        <section>
            <div className="login-form-holder">
                <h1 className="login-heading">Login</h1>
                <form
                    action="/"
                    method="get"
                    id="user-login-form"
                    onSubmit={submitHandler}
                >
                    <div className="login-holder">
                        <div className="login-user-input">
                            <label htmlFor="login-email">Email</label>
                            <input
                                type="text"
                                name="login-email"
                                id="login-email"
                                className={`login-input-email ${state.errors.email ? 'has-error' : ''} || ${state.success.email ? 'success' : ''}`}
                                placeholder="Email"
                                value={registeredUser.email}
                                onChange={e =>
                                    setRegisteredUser(prevState => ({
                                        ...prevState,
                                        email: e.target.value
                                    }))
                                }
                            />
                            {state.errors.email && (
                                <div className="error" id="error">
                                    {state.errors.email}
                                </div>
                            )}
                        </div>
                        <div className="login-user-input">
                            <label htmlFor="login-password">Password</label>
                            <input
                                type="password"
                                name="login-password"
                                id="login-password"
                                className={`login-input-password ${state.errors.password ? 'has-error' : ''} || ${state.success.password ? 'success' : ''}`}
                                placeholder="Password"
                                value={registeredUser.password}
                                onChange={e =>
                                    setRegisteredUser(prevState => ({
                                        ...prevState,
                                        password: e.target.value
                                    }))
                                }
                            />
                            {state.errors.password && (
                                <div className="error" id="error">
                                    {state.errors.password}
                                </div>
                            )}
                        </div>
                    </div>
                    <input type="submit" value="Login" className="submit-login" />
                </form>
            </div>
        </section>
    )
}

export default Login
