const Joi = require('joi');

const userSignUpSchema = Joi.object({
    name: Joi.string().min(2).max(64).required(),
    email: Joi.string().email().max(128).required(),
    password: Joi.string().min(6).max(64).required()
});

const userSignInSchema = Joi.object({
    email: Joi.string().email().max(128).required(),
    password: Joi.string().min(6).max(64).required()
});

module.exports = {userSignUpSchema, userSignInSchema};