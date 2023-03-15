import React, { useState, useReducer, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "../components/Navigation";
import '../assets/css/edituser.css'
import initialState from './InitialState'
import { reducer } from './Reducer'
import { useValidation } from "./Validation";

const EditUser = () => {
    const { newSuccess, newErrors, validateType } = useValidation();
    const [state, dispatch] = useReducer(reducer, initialState)
    const navigate = useNavigate()

    const locationSearch = window.location.search;
    let id = null;
    if (locationSearch) {
        const urlData = new URLSearchParams(locationSearch)
        id = Number(urlData.get('id'));
    }

    const foundUser = state.users.find(user => user.id === id)
    const [selectedUser, setSelectedUser] = useState({
        id: foundUser ? foundUser.id : '',
        fullName: foundUser ? foundUser.fullName : '',
        email: foundUser ? foundUser.email : '',
    })

    useEffect(() => {
        // check if the user is not logged in and navigate to the login page
        if (!JSON.parse(localStorage.getItem('loggedIn'))) {
            navigate('/')
        }
    }, [navigate]);

    useEffect(() => {
        dispatch({ type: 'setError', payload: newErrors })
        dispatch({ type: 'setSuccess', payload: newSuccess })
    }, [newErrors, newSuccess]);

    const handleFullNameChange = e => {
        setSelectedUser(prevState => ({
            ...prevState,
            fullName: e.target.value
        }))
    }

    const handleEmailChange = e => {
        setSelectedUser(prevState => ({
            ...prevState,
            email: e.target.value
        }))
    }

    const handleSubmit = e => {
        e.preventDefault()
        const type = validateType('EditUser');
        const { valid } = type.validateEditUserForm(selectedUser.id, selectedUser.fullName, selectedUser.email)
        switch (valid) {
            case true:
                const updatedUsers = state.users.map(user => {
                    if (user.id === id) {
                        return { ...user, fullName: selectedUser.fullName, email: selectedUser.email };
                    }
                    return user;
                });

                const updatedChats = state.chats.map(chat => {
                    if (chat.userId === id) {
                        return { ...chat, user: selectedUser.fullName, email: selectedUser.email };
                    }
                    return chat;
                });

                const updatedUploads = state.uploads.map(upload => {
                    if (upload.userId === id) {
                        return { ...upload, uploadedBy: selectedUser.fullName };
                    }
                    return upload;
                });

                if (id === state.currentUser.id) {
                    state.currentUser.fullName = selectedUser.fullName
                }
                dispatch({ type: 'setUsers', payload: updatedUsers });
                localStorage.setItem('users', JSON.stringify(updatedUsers));
                localStorage.setItem('loggedIn', JSON.stringify(state.currentUser));
                localStorage.setItem('chatMessages', JSON.stringify(updatedChats));
                localStorage.setItem('uploads', JSON.stringify(updatedUploads));
                navigate('/users');
                window.location.reload()
                break
            default:
                break
        }
    }

    return (
        //returning the main structure of the page with all the functionality needed
        <>
            <Navigation />
            <div className="edit-user-form">
                <h1>Edit User Information</h1>
                <div className="form-container">
                    <form
                        onSubmit={handleSubmit}
                    >
                        <div className="edit-input">
                            <div className="user-input">
                                <label htmlFor="edit-fullname">Full Name</label>
                                <input
                                    type="text"
                                    name="edit-fullname"
                                    id="edit-fullname"
                                    className={`fullNameInput ${state.errors.fullName ? 'has-error' : ''} || ${state.success.fullName ? 'success' : ''}`}
                                    value={selectedUser.fullName}
                                    onChange={handleFullNameChange}
                                />
                                {state.errors.fullName && (
                                    <div className="error" id="error">
                                        {state.errors.fullName}
                                    </div>
                                )}
                            </div>
                            <div className="user-input">
                                <label htmlFor="edit-email">Email</label>
                                <input
                                    type="email"
                                    name="edit-email"
                                    id="edit-email"
                                    className={`emailInput ${state.errors.email ? 'has-error' : ''} || ${state.success.email ? 'success' : ''}`}
                                    value={selectedUser.email}
                                    onChange={handleEmailChange} />
                                {state.errors.email && (
                                    <div className="error" id="error">
                                        {state.errors.email}
                                    </div>
                                )}
                            </div>
                        </div>
                        <button type="submit" className="submit-edit">Save</button>
                    </form>
                </div>
            </div>
        </>
    )
}

export default EditUser