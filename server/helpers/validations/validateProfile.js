import { check, validationResult } from 'express-validator/check';

const trimeSpaces = (input) => {
  const trimedString = input.replace(/^\s+|\s+$/g, '');
  return trimedString;
};

const validateProfileUpdate = {
  profileUpdate: [
    check('firstName', 'First name is required and should be a minimum of 3 characters')
      .isLength({ min: 3 })
      .custom((value) => {
        if (trimeSpaces(value).length < 3) {
          throw new Error('First name should be a minimum of 3 characters');
        } else {
          return value;
        }
      }),
    check('lastName', 'lastname is required and should be a minimum of 3 characters')
      .isLength({ min: 3 })
      .custom((value) => {
        if (trimeSpaces(value).length < 3) {
          throw new Error('Last name should be a minimum of 3 characters');
        } else {
          return value;
        }
      }),
    check('email', 'email is required')
      .exists(),
    check('email', 'Please, enter a valid email')
      .isEmail(),
  ],

  passwordChange: [
    check('password', 'password should be a minimum of 6 chracters')
      .isLength({ min: 6 })
      .custom((value, { req }) => {
        if (trimeSpaces(value).length < 6) {
          throw new Error('Password should be a minimum of 6 chracters');
        }
        if (value !== req.body.confirmPassword) {
          throw new Error("Password doesn't match");
        } else {
          return value;
        }
      }),
  ],
  validationResult,
};


export default validateProfileUpdate;
