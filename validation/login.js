const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateLoginInput(data) {
    
    let { email, password } = data;
    let errors = {};

    email = !isEmpty(email) ? email : '';
    password = !isEmpty(password) ? password : '';

    if (Validator.isEmpty(email)) {
        errors.email = 'Email field is required!';
    }
    
    if (!Validator.isEmail(email)) {
        errors.email = 'Email is invalid!';
    }

    if (Validator.isEmpty(password)) {
        errors.password = 'Password field is required!';
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
};