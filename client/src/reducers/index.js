import { combineReducers } from 'redux'
import authReducer from './authReducer'
import errorReducer from './errorRuducer'
import profileReducer from './profileReducer'
import postReducer from './postReducer'

export default combineReducers({
    auth: authReducer,
    profile: profileReducer,
    post: postReducer,
    errors: errorReducer
});