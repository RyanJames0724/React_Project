import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UseDeleteModal from "../components/DeleteModal";
import Navigation from "../components/Navigation";
import '../assets/css/users.css';

const Users = () => {
    const navigate = useNavigate()
    const users = JSON.parse(localStorage.getItem('users'))
    const currentUser = JSON.parse(localStorage.getItem('loggedIn'))
    const email = currentUser ? currentUser.email : null
    const [showDeleteModal, setShowDeleteModal] = useState({ isOpen: false, user: null });
    const [deleteType, setDeleteType] = useState('')

    useEffect(() => {
        // check if the user is not logged in and navigate to the login page
        if (!JSON.parse(localStorage.getItem('loggedIn'))) {
            navigate('/')
        }
    }, [navigate]);

    const handleEdit = user => {
        navigate('/edituser?id=' + user.id)
    }

    const handleDelete = (user) => {
        setDeleteType('User' || 'user')
        setShowDeleteModal({ isOpen: true, user: user })
    }

    const handleCloseModal = () => {
        setShowDeleteModal({ isOpen: false, user: null })
    }

    const emptyRow = [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}]; // creates an array with two empty objects

    const usersWithEmptyRow = users.concat(emptyRow); // concatenates the empty row to the existing uploads array

    console.log(usersWithEmptyRow);

    return (
        //returning the main structure of the page with all the functionality needed
        <>
            <Navigation />
            <div className="users-list-form">
                <nav className="navbar" id="navigation-bar"></nav>
                <div className="table-container">
                    <h1>Users</h1>
                    <table className="users-list-table" cellSpacing="0">
                        <colgroup>
                            <col className="users-first-column" />
                            <col className="users-second-column" />
                            <col className="users-third-column" />
                        </colgroup>
                        <thead>
                            <tr>
                                <th className="align-left">Name</th>
                                <th>User Email ID</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody className="t-body">
                            {usersWithEmptyRow && usersWithEmptyRow.map((user, index) => (
                                <tr key={index}>
                                    {user.id ? (
                                        <>
                                            <td className="align-left">{user.fullName}</td>
                                            <td>{user.email}</td>
                                            <td>
                                                {user.email === email ?
                                                    <button className="edit-button" onClick={() => handleEdit(user)}>Edit</button> :
                                                    <>
                                                        <button className="edit-button" onClick={() => handleEdit(user)}>Edit</button>
                                                        <span>|</span>
                                                        <button className="delete-button" onClick={() => handleDelete(user)}>Delete</button>
                                                    </>
                                                }
                                            </td>
                                        </>
                                    )
                                        :
                                        <>
                                            <td className="empty-table"></td>
                                            <td className="empty-table"></td>
                                            <td className="empty-table"></td>
                                        </>}
                                </tr>
                            ))}
                            {/* <TableUser times={15 - users.length} /> */}
                        </tbody>
                    </table>
                </div>
            </div>
            {showDeleteModal.isOpen && <UseDeleteModal selectedUser={showDeleteModal.user} onCancel={handleCloseModal} deleteType={deleteType} />}
        </>
    );
}

export default Users