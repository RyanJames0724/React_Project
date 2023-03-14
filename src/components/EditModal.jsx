import React, { useReducer, useState } from "react";
import '../assets/css/editmodal.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRectangleXmark } from '@fortawesome/free-solid-svg-icons'
import initialState from "../pages/InitialState";
import { reducer } from "../pages/Reducer";

export default function EditModal(props) {
    const [state, dispatch] = useReducer(reducer, initialState)
    const [fileDescription, setFileDescription] = useState(props.upload.fileDescription)
    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState({});

    //function for closing or hiding the modal
    const handleCancel = () => {
        props.onCancel();
    };

    //submitting the changes in file description
    const handleSubmit = () => {
        let valid = true;
        let newErrors = {};
        let newSuccess = {};

        if (!fileDescription) { //if there is no inputs in file description
            newErrors.fileDescription = "File Description is required";
            valid = false;
            setErrors(newErrors);
            return valid;
        } else {
            const result = state.uploads.filter(upload => upload.id === props.upload.id)
            result[0].fileDescription = fileDescription
            valid = true
            newSuccess.fileDescription = true
            dispatch({ type: 'setFileDescription', payload: state.uploads }) //dispatch for setting the file description
            localStorage.setItem('uploads', JSON.stringify(state.uploads))
            window.location.reload()
            setSuccess(newSuccess)
            return valid
        }
    }

    return (
        //returning the main structure of the page with all the functionality needed
        <div className="edit-main-container">

            <div className="edit-container" id="edit-modal">
                <div className="edit-upload-description">
                    <div className="edit-close">
                        <p>Edit</p>
                        <button className="close-edit-button" onClick={handleCancel}>
                            <FontAwesomeIcon className="close-modal-fa" size="3x" icon={faRectangleXmark} />
                        </button>
                    </div>
                </div>
                <div className="modal-main-content">
                    <div className="file-description-edit">
                        <label htmlFor="file-to-edit">File Description</label>
                        <input
                            type="text"
                            name="file-to-share"
                            id="file-to-share"
                            className={`edit-label ${errors.fileDescription ? 'has-error' : ''} || ${success.fileDescription ? 'success' : ''}`}
                            placeholder="Add file description"
                            value={fileDescription}
                            onChange={(e) => setFileDescription(e.target.value)}
                        />
                        {errors.fileDescription && (
                            <div className="error" id="error">
                                {errors.fileDescription}
                            </div>
                        )}
                    </div>
                    <div className="save-button-option">
                        <button className="save-button" onClick={handleSubmit}>Save</button>
                        <button className="cancel-save-button" onClick={handleCancel}>Cancel</button>
                    </div>
                </div>
            </div>
        </div>
    )
}
