import { check, validationResult } from 'express-validator/check';

const validateAuth = {

  login: [
    check('email', 'email is required')
      .isLength({ min: 1 }),
    check('password', 'password should be at least 6 chracters')
      .isLength({ min: 6 }),
  ],
  singUp: [
    check('firstName', 'firstaname is required and should be minimum of 2 characters')
      .isLength({ min: 2 }),
    check('lastName', 'lastname is required and should be minimum of 2 characters')
      .isLength({ min: 2 }),
    check('email', 'email is required')
      .isLength({ min: 1 }),
    check('password', 'password should be at least 6 chracters')
      .isLength({ min: 6 })
      .custom((value, { req }) => {
        if (value !== req.body.confirmPassword) {
          throw new Error("Passwords don't match");
        } else {
          return value;
        }
      }),
  ],
  validationResult,
};

export default validateAuth;
