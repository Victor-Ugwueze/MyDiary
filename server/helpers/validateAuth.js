import { check, validationResult } from 'express-validator/check';

const validateAuth = {

  login: [
    check('email', 'email is required')
      .isLength({ min: 1 }),
    check('password', 'password is required')
      .isLength({ min: 6 }),
  ],
  singUp: [
    check('firstName', 'firstaname is required')
      .isLength({ min: 1 }),
    check('lastName', 'lastname is required')
      .isLength({ min: 1 }),
    check('email', 'email is required')
      .isLength({ min: 1 }),
    check('password', 'invalid password')
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
