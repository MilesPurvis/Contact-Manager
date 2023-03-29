const { check, body, validationResult } = require('express-validator');
const { Contact } = require('../models/contacts');

const contactValidators = [
  check('name').notEmpty().withMessage('Please Enter your Name!'),
  check('email').isEmail().withMessage('Please Enter your Email address'),
  body('email').custom((value) => {
    return Contact.findOne({ contactEmail: value }).then((contact) => {
      if (contact) {
        return Promise.reject(`${value} is already in use`);
      }
    });
  }),
];

const editContactValidators = [
  check('name').notEmpty().withMessage('Please Enter your Name!'),
  check('email').isEmail().withMessage('Please Enter your Email address'),
];

module.exports = {
  contactValidators,
  validationResult,
  editContactValidators,
};
