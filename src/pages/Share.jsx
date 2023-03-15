import React, { useEffect, useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import UseDeleteModal from "../components/DeleteModal";
import Navigation from "../components/Navigation";
import '../assets/css/share.css'
import initialState from "./InitialState";
import { reducer } from "./Reducer";

const Share = () => {
    const [selectedUser, setSelectedUser] = useState('')
    const [state, dispatch] = useReducer(reducer, initialState)
    const navigate = useNavigate()
    const remainingUsers = state.users.filter(user => user.id !== state.currentUser.id)
    const [showDeleteModal, setShowDeleteModal] = useState({ isOpen: false, user: null });
    const [deleteType, setDeleteType] = useState('')

    const locationSearch = window.location.search;
    let id = null;
    if (locationSearch) {
        const urlData = new URLSearchParams(locationSearch)
        id = Number(urlData.get('id'));
    }

    const displayFile = state.uploads.find(upload => upload.id === id)

    useEffect(() => {
        // check if the user is not logged in and navigate to the login page
        if (!JSON.parse(localStorage.getItem('loggedIn'))) {
            navigate('/')
        }
    }, [navigate]);

    const changeValue = e => {
        setSelectedUser(e.target.value)
    }

    const handleShare = () => {
        const usersWithSameFile = state.uploads.filter(upload => upload.file === displayFile.file).filter(upload => upload.userId !== state.currentUser.id);
        if (usersWithSameFile.find(user => user.userId === +selectedUser)) {
            alert('File already uploaded by this user')
        } else {
            if (!displayFile.shareTo.find(user => user.selectedUserId === selectedUser)) {
                const updatedFile = {
                    ...displayFile,
                    shareTo: [...displayFile.shareTo, { selectedUserId: selectedUser }],
                };

                const updatedUploads = state.uploads.map(file =>
                    file.id === updatedFile.id ? updatedFile : file
                );

                localStorage.setItem('uploads', JSON.stringify(updatedUploads));
                dispatch({ type: 'setUserForSharing', payload: updatedUploads })
                return window.location.reload();
            } else {
                alert('File is already shared with this user');
            }
        }
    }

    const handleDelete = (selectedUserToShare) => {
        setDeleteType('SharedUser' || 'shareduser')
        setShowDeleteModal({ isOpen: true, user: selectedUserToShare })
    }

    const handleCloseModal = () => {
        setShowDeleteModal({ isOpen: false, user: null })
    }

    // const myUploads = state.uploads.filter(upload => upload.userId === state.currentUser.id)
    // const selectedFile = myUploads.find(upload => upload.id === id)

    return (
        <div>
            <Navigation />
            <div className="documents-container">
                <p className="change-font">Upload Sharing:</p>
                <p className="adding-size">{displayFile ? displayFile.file : null}</p>
                <table className="share-file-table" cellSpacing="0">
                    <colgroup>
                        <col className="share-first-column" />
                        <col className="share-second-column" />
                    </colgroup>
                    <thead>
                        <tr>
                            <th>Shared User</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody className="t-body">
                        {displayFile ? displayFile.shareTo.map((share, index) => (
                            <tr key={index}>
                                <td>{state.users.find(user => user.id === +share.selectedUserId).fullName}</td>
                                <td><button className="delete-button" onClick={() => handleDelete(share)}>Remove</button></td>
                            </tr>
                        )) : null}
                    </tbody>
                </table>
                <div className="sharing-container">
                    <p className="change-font">Add Sharing</p>
                    <div className="add-sharing-container">
                        <p>Choose User :</p>
                        <div className="share-select-holder">
                            <select value={selectedUser} onChange={changeValue}>
                                <option>Select User</option>
                                {remainingUsers.map((user, index) =>
                                    <option value={user.id} key={index}>{user.fullName}</option>
                                )}
                            </select>
                        </div>
                        <button className="add-share" onClick={handleShare}>Add Share</button>
                    </div>
                </div>
            </div>
            {showDeleteModal.isOpen && <UseDeleteModal fileId={id} selectedUser={showDeleteModal.user} onCancel={handleCloseModal} deleteType={deleteType} />}
        </div>
    )
}

export default Share