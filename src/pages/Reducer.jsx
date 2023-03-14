import initialState from "./InitialState"

const actions = {
    ADD_USER: 'addUser',
    INPUT_ERRORS: 'setError',
    INPUT_SUCCESS: 'setSuccess',
    LOGIN_USER: 'loginUser',
    SEND_CHAT: 'sendChat',
    UPDATE_USER: 'updateUser',
    DELETE_USER: 'deleteUser',
    ADD_UPLOAD: 'addUpload',
    LOAD_UPLOAD: 'loadUpload',
    SET_FILE_DESCRIPTION: 'setFileDescription',
    DELETE_UPLOAD_FILE: 'deleteUploadedFile',
    SHARE_FILE_TO_USER: 'setUserForSharing',
    REMOVE_USER_FROM_SHARING: 'removeUserFromSharing'
}

export const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actions.ADD_USER:
            return {
                ...state,
                users: [...state.users, action.payload]
            }
        case actions.INPUT_ERRORS:
            return {
                ...state,
                errors: action.payload
            }
        case actions.INPUT_SUCCESS:
            return {
                ...state,
                success: action.payload
            }
        case actions.LOGIN_USER:
            return {
                ...state,
                currentUser: action.payload
            }
        case actions.SEND_CHAT: //sending chats
            return {
                ...state, chats: [...state.chats, action.payload]
            }
        case actions.UPDATE_USER:
            return {
                ...state,
                users: [action.payload]
            }
        case actions.DELETE_USER: //deleting user
            const updatedUsers = state.users.filter(user => user.id !== action.payload);
            const updatedChats = state.chats.filter(chat => chat.userId !== action.payload);
            const updatedUploadsForUserDeletion = state.uploads.filter(upload => upload.userId !== action.payload).filter(updatedUpload => updatedUpload.shareTo.some(user => +user.selectedUserId === action.payload));
            updatedUploadsForUserDeletion.map(element => {
                return element.shareTo.filter(user => +user.selectedUserId !== action.payload)
            })
            console.log(action.payload);
            const updatedUploadsAfterRemovingShare = updatedUploadsForUserDeletion.map(updatedUpload => {
                return {
                    ...updatedUpload,
                    shareTo: updatedUpload.shareTo.filter(user => +user.selectedUserId !== action.payload)
                }
            })
            return { ...state, users: updatedUsers, chats: updatedChats, uploads: updatedUploadsAfterRemovingShare };
        case actions.ADD_UPLOAD: //adding a file to uploads
            return {
                ...state, uploads: [...state.uploads, action.upload]
            }
        case actions.LOAD_UPLOAD: //load upload
            return {
                ...state, uploads: [...state.uploads, action.payload]
            }
        case actions.SET_FILE_DESCRIPTION: //setting the file description
            return {
                ...state, uploads: action.payload
            }
        case actions.DELETE_UPLOAD_FILE: //delete upload just for documents
            const updatedUploadsForFileDeletion = state.uploads.filter(upload => upload.id !== action.payload);
            return { ...state, uploads: updatedUploadsForFileDeletion }
        case actions.SHARE_FILE_TO_USER:
            return {
                ...state,
                uploads: action.payload
            }
        case actions.REMOVE_USER_FROM_SHARING:
            const file = state.uploads.find(upload => upload.id === action.payload.selectedFileId);
            const updatedShareTo = file.shareTo.filter(userShared => +userShared.selectedUserId !== action.payload.selectedId)
            const updatedUploadsAfterRemoving = state.uploads.map(file => {
                return file.id === action.payload.selectedFileId ? { ...file, shareTo: updatedShareTo } : file
            })
            return { ...state, uploads: updatedUploadsAfterRemoving }
        default:
            throw new Error();
    }
}