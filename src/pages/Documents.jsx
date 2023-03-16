import React, { useState, useEffect } from "react";
import Navigation from "../components/Navigation";
import '../assets/css/documents.css'
import UseUploadModal from "../components/UploadModal.jsx";
import UseEditModal from "../components/EditModal.jsx";
import UseDeleteModal from "../components/DeleteModal.jsx";
import { useNavigate } from "react-router-dom";

const Documents = () => {
    const currentUser = JSON.parse(localStorage.getItem('loggedIn'))
    const users = JSON.parse(localStorage.getItem('users'))
    const id = currentUser ? currentUser.id : null
    const uploads = JSON.parse(localStorage.getItem('uploads')) || []
    const navigate = useNavigate()
    const [showModal, setShowModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [selectedUpload, setSelectedUpload] = useState(null);
    const [deleteType, setDeleteType] = useState('')
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    useEffect(() => {
        // check if the user is not logged in and navigate to the login page
        if (!JSON.parse(localStorage.getItem('loggedIn'))) {
            navigate('/')
        }
    }, [navigate]);

    //function for handling the add upload
    const handleAddUpload = () => {
        setIsEdit(false);
        setShowModal(true);
    };

    //function for handling the edit file
    const handleEdit = (upload) => {
        setIsEdit(true);
        setSelectedUpload(upload);
        setShowModal(true);
    };

    //function for handling the cancel
    const handleCancel = () => {
        setIsEdit(false);
        setSelectedUpload(null);
        setShowModal(false);
        setShowDeleteModal(false);
    };

    //function for handling the delete file
    const handleDelete = (upload) => {
        setSelectedUpload(upload);
        setShowDeleteModal(true);
        setDeleteType('File' || 'file')
    }

    const handleShare = (upload) => {
        navigate('/share?id=' + upload.id)
    }

    const uploadsFromOtherUsers = uploads.filter(upload =>
        upload.shareTo.some(user => +user.selectedUserId === id)
    );

    const emptyRowForMyUpload = [{}, {}]; // creates an array with two empty objects
    const emptyRowForShared = [{}, {}, {}]; // creates an array with two empty objects

    const myUploadsWithEmptyRow = uploads.filter(upload => upload.userId === id).concat(emptyRowForMyUpload); // concatenates the empty row to the existing uploads array
    const sharedUploadsWithEmptyRow = uploadsFromOtherUsers.concat(emptyRowForShared)
    console.log(sharedUploadsWithEmptyRow);
    return (
        //returning the main structure of the page with all the functionality needed
        <>
            <Navigation />
            <div className="documents-list-form">
                <div className="documents-container">
                    <p className="change-font">My Uploads</p>
                    <table className="my-uploads-table" cellSpacing="0">
                        <colgroup>
                            <col className="documents-first-column" />
                            <col className="documents-second-column" />
                            <col className="documents-third-column" />
                        </colgroup>
                        <thead>
                            <tr>
                                <th className="align-left">Label</th>
                                <th>File Name</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody className="table-body">
                            {myUploadsWithEmptyRow.map((upload, index) => (
                                <tr key={index}>
                                    {upload.fileDescription ? (
                                        <>
                                            <td className="align-left">{upload.fileDescription}</td>
                                            <td>{upload.file}</td>
                                            <td>
                                                <button className="edit-button" onClick={() => handleEdit(upload)}>
                                                    Edit
                                                </button>
                                                |
                                                <button className="delete-button" onClick={() => handleDelete(upload)}>
                                                    Delete
                                                </button>
                                                |
                                                <button className="share-button" onClick={() => handleShare(upload)}>
                                                    Share
                                                </button>
                                            </td>
                                        </>
                                    )
                                        :
                                        <>
                                            <td className="empty-table"></td>
                                            <td className="empty-table"></td>
                                            <td className="empty-table"></td>
                                        </>
                                    }
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="documents-container">
                    <p className="change-font">Shared Uploads</p>
                    <table className="shared-uploads-table" cellSpacing="0">
                        <colgroup>
                            <col className="documents-first-column" />
                            <col className="documents-second-column" />
                            <col className="documents-third-column" />
                        </colgroup>
                        <thead>
                            <tr>
                                <th className="align-left add-space">Label</th>
                                <th className="border-left">File Name</th>
                                <th className="border-left">Shared by</th>
                            </tr>
                        </thead>
                        <tbody id="table-body-shared">
                            {sharedUploadsWithEmptyRow.map((userUpload, index) => (
                                <tr key={index}>
                                    {userUpload.id ?
                                        <>
                                            <td className="align-left">{userUpload.fileDescription}</td>
                                            <td>{userUpload.file}</td>
                                            <td>{users.find(user => user.id === userUpload.userId).email}</td>
                                        </>
                                        :
                                        <>
                                            {index === sharedUploadsWithEmptyRow.length - 1 ?

                                                <>
                                                    <td className="empty-table align-left">
                                                        <button
                                                            className="upload-file-button"
                                                            id="upload-file-button"
                                                            onClick={handleAddUpload}
                                                        >
                                                            + Add Upload
                                                        </button>
                                                    </td>
                                                    <td className="empty-table"></td>
                                                    <td className="empty-table"></td>
                                                </>
                                                :
                                                <>
                                                    <td className="empty-table"></td>
                                                    <td className="empty-table"></td>
                                                    <td className="empty-table"></td>
                                                </>
                                            }
                                        </>
                                    }
                                </tr>
                            ))}

                        </tbody>
                    </table>
                    {showModal && !isEdit && (
                        <UseUploadModal onCancel={handleCancel} />
                    )}
                    {showModal && isEdit && (
                        <UseEditModal upload={selectedUpload} onCancel={handleCancel} />
                    )}
                    {showDeleteModal && (
                        <UseDeleteModal onCancel={handleCancel} upload={selectedUpload} deleteType={deleteType} />
                    )}
                </div>
            </div>
        </>
    );
}

export default Documents