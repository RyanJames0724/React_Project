import React, { useRef, useEffect, useReducer } from "react";
import '../assets/css/uploadmodal.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRectangleXmark } from '@fortawesome/free-solid-svg-icons'
import initialState from "../pages/InitialState";
import { reducer } from "../pages/Reducer";
import { useValidation } from "../pages/Validation";

export default function UploadModal(props) {
    const { newSuccess, newErrors, validateType } = useValidation();
    const currentUser = JSON.parse(localStorage.getItem('loggedIn'))
    const [state, dispatch] = useReducer(reducer, initialState)
    const inputDescriptionRef = useRef(null)
    const inputFileRef = useRef(null)

    useEffect(() => {
        dispatch({ type: 'setError', payload: newErrors })
        dispatch({ type: 'setSuccess', payload: newSuccess })
    }, [newErrors, newSuccess]);

    const findSharedById = state.uploads.filter(upload => upload.shareTo.some(user => +user.selectedUserId === currentUser.id));

    //handling upload now
    const handleUpload = e => {
        e.preventDefault();
        const fullPath = inputFileRef.current.value;
        const fileName = fullPath.replace("C:\\fakepath\\", "");
        const type = validateType('UploadFile');
        const { valid } = type.validateUpload(inputDescriptionRef.current.value, inputFileRef.current.value)
        const myUploads = state.uploads.filter(upload => upload.userId === currentUser.id);
        const isFileAlreadyUploaded = !!myUploads.find(upload => upload.file === fileName)
        const isFileAlreadyaShared = !!findSharedById.find(sharedFile => sharedFile.file === fileName);
        switch (valid) {
            case true:
                if (isFileAlreadyUploaded) {
                    alert('You already uploaded this file')
                } else {
                    if (isFileAlreadyaShared) {
                        alert('This file already shared to you')
                    } else {
                        const newUploads = { //constructing the new uploads object
                            id: Number(new Date()),
                            uploadedBy: currentUser.fullName,
                            userId: state.currentUser.id,
                            file: fileName,
                            fileDescription: inputDescriptionRef.current.value,
                            shareTo: []
                        }
                        dispatch({ type: 'addUpload', upload: newUploads })//calling the dispatch for adding the upload
                        window.location.reload()
                    }
                }
                break
            default:
                break
        }
    }

    useEffect(() => {
        localStorage.setItem('uploads', JSON.stringify(state.uploads)); // setting the uplaods on local storage when there are changes in state uploads
    }, [state.uploads]);

    //function for cancel or hiding the modal
    const handleCancel = () => {
        props.onCancel();
    };

    return (
        //returning the main structure of the page with all the functionality needed
        <div className="upload-main-container">
            <div className="upload-container" id="upload-modal">
                <div className="file-upload-container">
                    <div className="upload-close">
                        <p>Upload</p>
                        <button className="close-upload-button" onClick={handleCancel}>
                            <FontAwesomeIcon className="close-modal-fa" size="3x" icon={faRectangleXmark} />
                        </button>
                    </div>
                </div>
                <div className="modal-main-content">
                    <div className="file-description">
                        <label htmlFor="file-to-upload-description">File Description</label>
                        <input
                            type="text"
                            name="file-to-share"
                            id="file-to-share"
                            className={`upload-label ${state.errors.fileDescription ? 'has-error' : ''} || ${state.success.fileDescription ? 'success' : ''}`}
                            placeholder="Input File Name"
                            ref={inputDescriptionRef}
                        />
                        {state.errors.fileDescription && (
                            <div className="error" id="error">
                                {state.errors.fileDescription}
                            </div>
                        )}
                    </div>
                    <div className="file-to-upload">
                        <label htmlFor="file-to-upload">File Upload</label>
                        <input
                            type="file"
                            name="user-file"
                            id="user-file"
                            className="choose"
                            ref={inputFileRef}
                        />
                        {state.errors.fileInput && (
                            <div className="error" id="error">
                                {state.errors.fileInput}
                            </div>
                        )}
                    </div>
                    <div className="upload-button-option">
                        <button className="upload-button" onClick={handleUpload}>Upload Now</button>
                        <button className="cancel-upload-button" onClick={handleCancel}>Cancel</button>
                    </div>
                </div>
            </div>
        </div>
    )
}