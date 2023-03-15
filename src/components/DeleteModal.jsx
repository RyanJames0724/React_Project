import React, { useReducer, useEffect } from "react";
import '../assets/css/deletemodal.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRectangleXmark, faQuestionCircle } from '@fortawesome/free-solid-svg-icons'
import initialState from "../pages/InitialState";
import { reducer } from "../pages/Reducer";

export default function UseDeleteModal(props) {
    const [state, dispatch] = useReducer(reducer, initialState)
    //function for closing or hiding the modal
    const handleCloseButton = () => {
        props.onCancel();
    };

    //function for handling the delete or ok button
    const handleDeleteButton = () => {
        if (props.deleteType === 'User' || props.deleteType === 'user') { //for the deletetype = user
            const id = props.selectedUser.id
            dispatch({ type: 'deleteUser', payload: id })
            window.location.reload()
        } else if (props.deleteType === 'File' || props.deleteType === 'file') { // for the deletetype = file
            const id = props.upload.id
            dispatch({ type: 'deleteUploadedFile', payload: id })
            window.location.reload()
        } else if (props.deleteType === 'SharedUser' || props.deleteType === 'shareduser') {
            const userId = +props.selectedUser.selectedUserId
            const id = props.fileId
            dispatch({ type: 'removeUserFromSharing', payload: { selectedId: userId, selectedFileId: id } })
            window.location.reload()
        }
    }



    //setting the changes on state to the local storage uding the useEffect
    useEffect(() => {
        localStorage.setItem('chatMessages', JSON.stringify(state.chats))
        localStorage.setItem('users', JSON.stringify(state.users))
        localStorage.setItem('uploads', JSON.stringify(state.uploads))
    }, [state.users, state.chats, state.uploads])

    return (
        //returning the main structure of the page with all the functionality needed
        <div className="main-container">
            <div className="delete-container" id="delete-modal">
                <div className="delete-option-container">
                    <div className="delete-close">
                        <p>Confirm {props.deleteType} Deletion</p>
                        <button className="close-delete-button" onClick={handleCloseButton}>
                            <FontAwesomeIcon className="close-modal-fa" size="2x" icon={faRectangleXmark} />
                        </button>
                    </div>
                </div>
                <div className="ques-mark">
                    <FontAwesomeIcon size="4x" icon={faQuestionCircle} />
                    <p>Are you Sure?</p>
                </div>
                <div className="delete-option">
                    <button className="confirm okay-button" onClick={handleDeleteButton}>ok</button>
                    <button className="cancel cancel-button" onClick={handleCloseButton}>
                        cancel
                    </button>
                </div>
            </div>
        </div>
    );
}
