import { combineReducers } from 'redux'
import authReducer from './authReducer'
import errorReducer from './errorRuducer'
import profileReducer from './profileReducer'

export default combineReducers({
    auth: authReducer,
    profile: profileReducer,
    errors: errorReducer
});