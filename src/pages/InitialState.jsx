const initialState = {
    errors: {},
    success: {},
    users: localStorage.getItem('users') ? JSON.parse(localStorage.getItem('users')) : [],
    currentUser: localStorage.getItem('loggedIn') ? JSON.parse(localStorage.getItem('loggedIn')) : [],
    chats: localStorage.getItem('chatMessages') ? JSON.parse(localStorage.getItem('chatMessages')) : [],
    uploads: localStorage.getItem('uploads') ? JSON.parse(localStorage.getItem('uploads')) : []
}

export default initialState