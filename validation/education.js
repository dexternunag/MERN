const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateEducationInput(data) {
    
    let {  school,  degree, fieldofstudy, from } = data;
    let errors = {};

    school = !isEmpty(school) ? school : '';
    degree = !isEmpty(degree) ? degree : '';
    fieldofstudy = !isEmpty(fieldofstudy) ? fieldofstudy : '';
    from = !isEmpty(from) ? from : '';

    if (Validator.isEmpty(school)) {
        errors.school = 'School field is required';
    }

    if (Validator.isEmpty(degree)) {
        errors.degree = 'Degree field is required';
    }

    if (Validator.isEmpty(fieldofstudy)) {
        errors.fieldofstudy = 'Field of study is required';
    }

    if (Validator.isEmpty(from)) {
        errors.from = 'From date field is required';
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
};