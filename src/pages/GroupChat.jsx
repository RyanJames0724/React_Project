import React, { useEffect, useRef, useReducer } from "react";
import '../assets/css/groupchat.css'
import Navigation from '../components/Navigation'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRectangleXmark } from '@fortawesome/free-solid-svg-icons'
import initialState from "./InitialState";
import { reducer } from "./Reducer";
import { useNavigate } from "react-router-dom";

export default function GroupChat() { //props for getting the current user
    const navigate = useNavigate()
    const [state, dispatch] = useReducer(reducer, initialState)
    const inputRef = useRef(null);

    useEffect(() => {
        // check if the user is not logged in and navigate to the login page
        if (!JSON.parse(localStorage.getItem('loggedIn'))) {
            navigate('/')
        }
    }, [navigate]);

    // Save messages to local storage each time the 'messages' state changes
    useEffect(() => {
        localStorage.setItem('chatMessages', JSON.stringify(state.chats));
    }, [state.chats]);

    //function for handling the message
    const handleMessageSend = () => {
        if (!inputRef.current.value || !inputRef.current.value.trim()) { //empty inputs
            alert('Message is required before sending')
        } else {
            const message = { //constructing the object which contains the information that can set to local storage using the dispatch
                id: Number(new Date()), // Generates a random number between 0 and 99999
                date:
                    `${new Date().getFullYear()}-` +
                    `${(new Date().getMonth() + 1).toString().padStart(2, '0')}-` +
                    `${new Date().getDate().toString().padStart(2, '0')} ` +
                    `${new Date().getHours().toString().padStart(2, '0')}:` +
                    `${new Date().getMinutes().toString().padStart(2, '0')}:` +
                    `${new Date().getSeconds().toString().padStart(2, '0')}`,
                user: state.currentUser.fullName,
                email: state.currentUser.email,
                userId: state.currentUser.id,
                content: inputRef.current.value
            };

            dispatch({ type: 'sendChat', payload: message });
            inputRef.current.value = "";
            window.location.reload()
        }
    };

    const handleRefresh = () => {
        window.location.reload()
    };

    return (
        //returning the main structure of the page with all the functionality needed
        <>
            <Navigation />
            <div className="chat-form">
                <div className="chat-container">
                    <div className="chat-close">
                        <p>Group Chat</p>
                        <div className="close-image">
                            <FontAwesomeIcon className="close-modal-fa" size="2x" icon={faRectangleXmark} />
                        </div>
                    </div>
                    <div className="chat-main-content">
                        {state.chats.map((message, index) => (
                            <div key={index}>
                                <p>[{message.date}] {message.user}: {message.content}</p>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="user-message-container">
                    <p className="current-user-name">{state.currentUser.fullName}</p>
                    <textarea name="user-message" id="user-message" className="user-message" ref={inputRef} placeholder="Input messages here"></textarea>
                    <div className="message-button">
                        <button className="send-message-button" onClick={handleMessageSend}>Send</button>
                        <button className="refresh-page-button" onClick={handleRefresh}>Refresh</button>
                    </div>
                </div>
            </div>
        </>
    )
}
