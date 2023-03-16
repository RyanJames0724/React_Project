import React, { useRef, useState, useEffect, useReducer } from "react";
import { useNavigate } from "react-router-dom";
import '../assets/css/register.css'
import initialState from './InitialState'
import { reducer } from './Reducer'
import { useValidation } from "./Validation";

const Register = () => {
    const { newSuccess, newErrors, validateType } = useValidation();
    const [state, dispatch] = useReducer(reducer, initialState)
    const [user, setUser] = useState({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const navigate = useNavigate()

    // Create refs for all the input fields
    const fullNameRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();
    const confirmPasswordRef = useRef();

    useEffect(() => {
        // Determine which input field is empty and apply focus to it
        if (!user.fullName) {
            fullNameRef.current.focus();
        }
    }, [user]);

    useEffect(() => {
        dispatch({ type: 'setError', payload: newErrors })
        dispatch({ type: 'setSuccess', payload: newSuccess })
    }, [newErrors, newSuccess]);

    const submitHandler = e => {
        e.preventDefault();
        const type = validateType('Registration');
        const { valid } = type.validateRegistrationForm(user.fullName, user.email, user.password, user.confirmPassword)
        switch (valid) {
            case true:
                const newUser = {
                    id: Number(new Date()), // Generates a random number between 0 and 99999
                    fullName: user.fullName,
                    email: user.email,
                    password: user.password,
                    isLogin: false,
                };

                const userList = JSON.parse(localStorage.getItem("users")) || [];
                const updatedUserList = [...userList, newUser];
                localStorage.setItem("users", JSON.stringify(updatedUserList));
                dispatch({ type: "addUser", payload: updatedUserList });
                alert("You are now registered");
                navigate("/registersuccess");
                break;
            default:
                break;
        }
    };


    return (
        //returning the main structure of the page with all the functionality needed
        <section>
            <div className="register-form-holder">
                <header>
                    <h1 className="registration-heading">Register</h1>
                </header>
                <form
                    method="get"
                    onSubmit={submitHandler}
                    id="users-register-form"
                >
                    <div className="registration-holder">
                        <div className="register-user-input">
                            <label htmlFor="registerName">Full Name</label>
                            <input
                                type="text"
                                name="registerName"
                                id="registerName"
                                className={`register-input-name ${state.errors.fullName ? 'has-error' : ''} || ${state.success.fullName ? 'success' : ''}`}
                                placeholder="Fullname"
                                value={user.fullName}
                                onChange={(e) =>
                                    setUser((prevState) => ({
                                        ...prevState,
                                        fullName: e.target.value,
                                    }))
                                }
                                ref={fullNameRef} // Assign the ref to the input field
                            />
                            {state.errors.fullName && (
                                <div className="error" id="error">
                                    {state.errors.fullName}
                                </div>
                            )}
                        </div>
                        <div className="register-user-input">
                            <label htmlFor="registerEmail">Email</label>
                            <input
                                type="text"
                                name="registerEmail"
                                id="registerEmail"
                                className={`register-input-email ${state.errors.email ? 'has-error' : ''
                                    } ${state.success.email ? 'success' : ''}`}
                                placeholder="Email"
                                value={user.email}
                                onChange={(e) =>
                                    setUser((prevState) => ({
                                        ...prevState,
                                        email: e.target.value,
                                    }))
                                }
                                ref={emailRef} // Assign the ref to the input field
                            />
                            {state.errors.email && (
                                <div className="error" id="error">
                                    {state.errors.email}
                                </div>
                            )}
                        </div>
                        <div className="register-user-input">
                            <label htmlFor="registerPassword">Password</label>
                            <input
                                type="password"
                                name="registerPassword"
                                id="registerPassword"
                                className={`register-input-password ${state.errors.password ? 'has-error' : ''} || ${state.success.password ? 'success' : ''}`}
                                placeholder="Password"
                                value={user.password}
                                onChange={(e) =>
                                    setUser((prevState) => ({
                                        ...prevState,
                                        password: e.target.value,
                                    }))
                                }
                                ref={passwordRef} // Assign the ref to the input field
                            />
                            {state.errors.password && (
                                <div className="error" id="error">
                                    {state.errors.password}
                                </div>
                            )}
                        </div>
                        <div className="register-user-input">
                            <label htmlFor="passwordConfirm">Confirm Password</label>
                            <input
                                type="password"
                                name="passwordConfirm"
                                id="passwordConfirm"
                                className={`register-input-confirm ${state.errors.confirmPassword ? 'has-error' : ''} || ${state.success.confirmPassword ? 'success' : ''}`}
                                placeholder="Confirm Password"
                                value={user.confirmPassword}
                                onChange={(e) =>
                                    setUser((prevState) => ({
                                        ...prevState,
                                        confirmPassword: e.target.value,
                                    }))
                                }
                                ref={confirmPasswordRef} // Assign the ref to the input field
                            />
                            {state.errors.confirmPassword && (
                                <div className="error" id="error">
                                    {state.errors.confirmPassword}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="submit-holder">
                        <input type="submit" value="Register" className="submit-registration" />
                    </div>
                </form>
            </div>
        </section>
    )
}

export default Register