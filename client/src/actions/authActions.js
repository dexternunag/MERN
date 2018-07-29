import axios from 'axios';
import setAuthToken from '../utils/setAuthToken';
import jwt_decode from 'jwt-decode';

import { SET_CURRENT_USER, GET_ERRORS } from './types';

// Register User
export const registerUser = (userData, history) => dispatch => {
    axios.post('/api/users/register', userData)
            .then(res => history.push('/login'))
            .catch(err => 
                dispatch({
                    type: GET_ERRORS,
                    payload: err.response.data
                })
            );
};

// Login - Get User Token
export const loginUser = (userData) => dispatch => {
    axios.post('/api/users/login', userData)
            .then(res => {
                const { token } = res.data;

                // Set to localstorage
                localStorage.setItem('jwtToken', token);
                // Set to Auth header
                setAuthToken(token);
                // Decode token to get user data
                const decode = jwt_decode(token);
                // Set current user
                dispatch(setCurrentUser(decode));
            })
            .catch(err => 
                dispatch({
                    type: GET_ERRORS,
                    payload: err.response.data
                })
            );
};

// Set Logged in User
export const setCurrentUser = decoded => {
    return {
        type: SET_CURRENT_USER,
        payload: decoded
    }
}

// Log user out
export const logoutUser = () => dispatch => {
    // Remove token from localStorage
    localStorage.removeItem('jwtToken');
    // Remove the auth header for future requests
    setAuthToken(false);
    // Set current user to {} which will set authenticated to false
    dispatch(setCurrentUser({}));
}