import { useState } from 'react';

export const useValidation = () => {
    const [newErrors, setNewErrors] = useState({});
    const [newSuccess, setNewSuccess] = useState({});
    const registeredUsers = JSON.parse(localStorage.getItem('users'));

    const setErrorsAndSuccess = (field, message, isValid) => {
        setNewErrors(prevState => ({ ...prevState, [field]: message }));
        setNewSuccess(prevState => ({ ...prevState, [field]: isValid }));
    }

    const validateName = (name, type) => {
        if ((type === 'Register' && registeredUsers && registeredUsers.some(registeredUser => registeredUser.fullName === name)) || !name) {
            setErrorsAndSuccess('fullName', !name ? 'Fullname is required' : 'Fullname already exist', false)
            return false
        } else {
            setErrorsAndSuccess('fullName', '', true)
            return true
        }
    }

    const validateEmail = (email, type) => {
        // Regular expression for email validation
        const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/;

        if ((type === 'Register' && registeredUsers && registeredUsers.some(registeredUser => registeredUser.email === email)) || !email) {
            setErrorsAndSuccess('email', !email ? 'Email is required' : 'Email already exist', false)
            return false
        } else if (!emailRegex.test(email)) {
            setErrorsAndSuccess('email', 'Email is invalid', false);
            return false
        } else if (type === 'Login' && registeredUsers && !registeredUsers.some(registeredUser => registeredUser.email === email)) {
            setErrorsAndSuccess('email', 'Email does not exist', false);
            return false
        } else {
            setErrorsAndSuccess('email', '', false);
            return true
        }
    };

    const validatePassword = (password, type) => {

        if ((type === 'Register' && registeredUsers && registeredUsers.some(registeredUser => registeredUser.password === password)) || !password) {
            setErrorsAndSuccess('password', !password ? 'Password is required' : 'Password already exist', false)
            return false
        } else if (password.length < 8) {
            setErrorsAndSuccess('password', 'Password must be at least 8 characters', false);
            return false
        } else if (type === 'Login' && registeredUsers && !registeredUsers.some(registeredUser => registeredUser.password === password)) {
            setErrorsAndSuccess('password', 'Password does not exist', false);
            return false
        } else {
            setErrorsAndSuccess('password', '', true);
            return true
        }
    };


    const validateConfirmPassword = (password, confirmPassword) => {
        if (!confirmPassword) {
            setErrorsAndSuccess('confirmPassword', 'Confirm password is required', false)
            return false
        } else if (confirmPassword !== password) {
            setErrorsAndSuccess('confirmPassword', 'Passwords do not match', false)
            return false
        } else {
            setErrorsAndSuccess('confirmPassword', '', true)
            return true
        }
    }



    const validateEditUser = (id, name, email) => {
        const remainingUsers = registeredUsers.filter(userToFilter => userToFilter.id !== id)

        const nameIsValid = validateName(name)
        const emailIsValid = validateEmail(email)

        if (nameIsValid && emailIsValid) {
            const nameUsed = remainingUsers.some(user => user.fullName === name)
            const emailUsed = remainingUsers.some(user => user.email === email)

            setErrorsAndSuccess('fullName', nameUsed ? 'Fullname already used by other users' : '', !nameUsed)
            setErrorsAndSuccess('email', emailUsed ? 'Email already used by other users' : '', !emailUsed)

            return { valid: !nameUsed && !emailUsed }
        }

        return { valid: false }
    }





    const checkUpload = (description, file) => {
        const descriptionRequired = !description ? 'File Description is required' : ''
        const fileRequired = !file ? 'File Input is required' : ''
      
        setErrorsAndSuccess('fileDescription', descriptionRequired, !!description)
        setErrorsAndSuccess('fileInput', fileRequired, !!file)
      
        return description && file ? true : false
      }
      

    const validateType = type => {
        switch (type) {
            case 'Registration':
                const validateRegistrationForm = (name, email, password, confirmPassword) => {
                    const nameIsValid = validateName(name, 'Register')
                    const emailIsValid = validateEmail(email, 'Register')
                    const passwordIsValid = validatePassword(password, 'Register')
                    const confirmPasswordIsValid = validateConfirmPassword(password, confirmPassword)
                    const isValid = nameIsValid && emailIsValid && passwordIsValid && confirmPasswordIsValid
                    return { newSuccess, newErrors, valid: isValid };
                };
                return { newSuccess, newErrors, validateRegistrationForm }
            case 'Login':
                const validateLoginForm = (email, password) => {
                    const emailIsValid = validateEmail(email, 'Login')
                    const passwordIsValid = validatePassword(password, 'Login')
                    const isValid = emailIsValid && passwordIsValid
                    return { newSuccess, newErrors, valid: isValid };
                };
                return { newSuccess, newErrors, validateLoginForm }
            case 'EditUser':
                const validateEditUserForm = (id, name, email) => {
                    return validateEditUser(id, name, email)
                }
                return { newSuccess, newErrors, validateEditUserForm }
            case 'UploadFile':
                const validateUpload = (description, file) => {
                    const isValid = checkUpload(description, file)
                    return { newSuccess, newErrors, valid: isValid };
                }
                return { newSuccess, newErrors, validateUpload }
            default:
                break
        }
    };

    return { newSuccess, newErrors, validateType };
}
