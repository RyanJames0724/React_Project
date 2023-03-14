import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Documents from "./Documents.jsx";
import EditUser from "./EditUser.jsx";
import Groupchat from "./GroupChat.jsx";
import Login from "./Login.jsx";
import LoginSuccess from "./LoginSuccess.jsx";
import Logout from "./Logout.jsx";
import Register from "./Register.jsx"
import RegisterSuccess from "./RegisterSuccess.jsx";
import Share from "./Share.jsx";
import Users from "./Users.jsx";
import Welcome from "./Welcome.jsx";

const isLoggedIn = () => {
    return localStorage.getItem("loggedIn") === "true";
}

const Main = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Welcome />} />
                <Route path="/register" element={<Register />} />
                <Route path="/registersuccess" element={<RegisterSuccess />} />
                <Route path="/login" element={<Login />} />
                {isLoggedIn ? (
                    <>
                        <Route path="/loginsuccess" element={<LoginSuccess />} />
                        <Route path="/groupchat" element={<Groupchat />} />
                        <Route path="/users" element={<Users />} />
                        <Route path="/edituser" element={<EditUser />} />
                        <Route path="/documents" element={<Documents />} />
                        <Route path="/share" element={<Share />} />
                    </>
                ) : (
                    <Route path="/login" element={<Login />} />
                )}
                <Route path="/logout" element={<Logout />} />
            </Routes>
        </BrowserRouter>
    )
}

export default Main
