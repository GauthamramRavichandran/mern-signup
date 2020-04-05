const Validator = require('validator');
const isEmpty = require('is-empty');

module.exports = function validateUpdateInput(data){
    let errors = {};
    data.name = !isEmpty(data.name) ? data.name : "";
    data.email = !isEmpty(data.email) ? data.email : "";
    data.dob = !isEmpty(data.dob) ? data.dob : "";
    //data.contact = !isEmpty(data.contact) ? data.contact : "";

    // Name checks
    if (Validator.isEmpty(data.name)) {
        errors.name = "Name field is required";
    }
    // Email checks
    if (Validator.isEmpty(data.email)) {
        errors.email = "Email field is required";
    } 
    else if (!Validator.isEmail(data.email)) {
        errors.email = "Email is invalid";
    }
    // Password checks
    if (Validator.isEmpty(data.dob)) {
        errors.dob = "DOB field is required";
    }
    /*if (Validator.isEmpty(data.contact)) {
        errors.password2 = "Contact field is required";
    }*/
    
    return {
    errors,
    isValid: isEmpty(errors)
  };
};