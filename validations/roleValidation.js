const Joi = require('joi');

const roleSchema = Joi.object({
    name: Joi.string().min(2).max(64).required()
});

module.exports = roleSchema;