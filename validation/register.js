const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateRegisterInput(data) {
    const { name, email, password } = data;
    const errors = {};

    name = !isEmpty(name) ? name : '';
    email = !isEmpty(email) ? email : '';
    password = !isEmpty(password) ? password : '';

    if (!Validator.isLength(name, {min: 2, max: 30})) {
        errors.name = 'Name must be between 2 and 30 characters';
    }

    if (Validator.isEmpty(name)) {
        errors.name = 'Name field is required!';
    }

    if (Validator.isEmpty(email)) {
        errors.email = 'Email field is required!';
    }
    
    if (!Validator.isEmail(email)) {
        errors.email = 'Email is invalid!';
    }

    if (!Validator.isLength(password, {min: 6, max: 30})) {
        errors.password = 'Password field is required!';
    }

    if (Validator.isEmpty(password)) {
        errors.password = 'Password field is required!';
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
};