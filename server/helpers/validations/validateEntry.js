import { check, validationResult } from 'express-validator/check';

const trimeSpaces = (input) => {
  const trimedString = input.replace(/^\s+|\s+$/g, '');
  return trimedString;
};
const validateEntry = {
  ValidateInput: [
    check('title', 'Title is required')
      .exists(),
    check('title', 'Title should be 6 chracters long or more')
      .isLength({ min: 6 })
      .custom((value) => {
        const regex = /^[0-9]+$/;
        if (regex.test(value)) {
          throw new Error('Title should contain Alphanumreic characters');
        } else if (trimeSpaces(value).length < 6) {
          throw new Error('Title should be 6 chracters long or more');
        } else {
          return value;
        }
      }),
    check('body', 'Body is required')
      .exists(),
    check('body', 'Body should be 6 chracters long or more')
      .isLength({ min: 6 })
      .custom((value) => {
        const regex = /^[0-9]+$/;
        if (regex.test(value)) {
          throw new Error('Body should contain Alphanumreic characters');
        } else if (trimeSpaces(value).length < 6) {
          throw new Error('Body should be 6 chracters long or more');
        } else {
          return value;
        }
      }),
  ],
  validationResult,
};
export default validateEntry;
