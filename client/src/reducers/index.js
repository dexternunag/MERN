import { combineReducers } from 'redux';
import authReducer from './authReducer';
import errorReducer from './errorRuducer';


export default combineReducers({
    auth: authReducer,
    errors: errorReducer
});