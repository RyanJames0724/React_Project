import React from "react";
import { useNavigate } from "react-router-dom";
import '../assets/css/welcome.css'

const Welcome = () => {

    const navigate = useNavigate()

    const handler = (event) => {
        const target = event.target

        switch(target.name) {
            case 'login':
                navigate('/login')
                window.location.reload()
                break
            case 'register':
                navigate('/register')
                window.location.reload()
                break
            default:
                break
        }
    }

    return (
        //returning the main structure of the page with all the functionality needed
        <section>
            <div className="welcome-container">
                <div className="user-option">
                    <h1>Welcome to Users Module</h1>
                    <div>
                        <p>Existing Users</p>
                        <button name="login" onClick={handler}>Login</button>
                    </div>
                    <div>
                        <p>New Users</p>
                        <button name="register" onClick={handler}>Register</button>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Welcome