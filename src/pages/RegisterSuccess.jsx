import React from "react";
import { Link } from "react-router-dom";
import '../assets/css/registersuccess.css'

const RegisterSuccess = () => {
    return (
        <section>
            <div className="registration-success-container">
                <h1>Registration Successful</h1>
                <p>Thankyou for your resgistration</p>
                <Link to='/'>Click to return to home page</Link>
            </div>
        </section>
    )
}

export default RegisterSuccess