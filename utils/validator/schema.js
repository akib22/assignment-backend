const Joi = require('joi');

const schema = {
  signUp: Joi.object({
    name: Joi.string().required(),
    password: Joi.string().required(),
    email: Joi.string().email().required(),
    phoneNumber: Joi.string().required(),
  }).options({ abortEarly: false }),
};

module.exports = schema;
