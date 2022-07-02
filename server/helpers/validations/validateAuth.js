import { body, validationResult } from 'express-validator';



const validateAuth = {

  login: [
    body('email')
      .notEmpty()
    .withMessage('email', 'please, enter a valid email')
      .isEmail(),
      body('password', 'password is required')
      .exists(),
  ],
  singUp: [
    body('firstName', 'firstName is required and should be a minimum of 2 characters')
    .notEmpty()
    .trim()
    .isLength({ min: 3 }),
      body('lastName', 'lastName is required and should be a minimum of 2 characters')
      .trim()
      .isLength({ min: 3 }),
      body('email', 'email is required')
      .exists()
      .isEmail(),
      body('password', 'password and should be a minimum of 6 characters')
    .trim()
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
