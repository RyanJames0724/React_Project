import React, { useEffect } from "react";
import '../assets/css/loginsuccess.css'
import Navigation from "../components/Navigation";
import { useNavigate } from "react-router-dom";

const LoginSuccess = () => {
    const navigate = useNavigate()
    const currentUser = JSON.parse(localStorage.getItem('loggedIn'))
    const email = currentUser ? currentUser.email : null

    useEffect(() => {
        // check if the user is not logged in and navigate to the login page
        if (!currentUser) {
            navigate('/')
        }
    }, [navigate, currentUser]);

    return (
        //returning the main structure of the page with all the functionality needed and displaying the email
        <>
            <Navigation />
            <div className="login-success">
                <div>
                    <h1>Login Successful</h1>
                    {email ? (
                        <p><strong>Welcome ! </strong> <span>{email}</span></p>
                    ) : (
                        <p>Loading...</p>
                    )}
                </div>
            </div>
        </>
    )
}


export default LoginSuccess