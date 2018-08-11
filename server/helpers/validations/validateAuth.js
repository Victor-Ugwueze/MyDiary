import { check, validationResult } from 'express-validator/check';

const trimeSpaces = (input) => {
  const trimedString = input.replace(/^\s+|\s+$/g, '');
  return trimedString;
};

const validateAuth = {

  login: [
    check('email', 'email is required')
      .exists(),
    check('email', 'please, enter a valid email')
      .isEmail(),
    check('password', 'password is required')
      .exists(),
  ],
  singUp: [
    check('firstName', 'firstaname is required and should be a minimum of 2 characters')
      .isLength({ min: 3 })
      .custom((value) => {
        if (trimeSpaces(value).length < 3) {
          throw new Error('First name should be a minimum of 3 characters');
        } else {
          return value;
        }
      }),
    check('lastName', 'lastname is required and should be a minimum of 2 characters')
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
    check('email', 'please, enter a valid email')
      .isEmail(),
    check('password', 'password should be a minimum of 6 chracters')
      .isLength({ min: 6 })
      .custom((value, { req }) => {
        if (value !== req.body.confirmPassword) {
          throw new Error("Password doesn't match");
        } else {
          return value;
        }
      }),
  ],
  validationResult,
};

export default validateAuth;
