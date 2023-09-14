const Joi = require('joi');

const memberSchema = Joi.object({
    community: Joi.string().required(),
    user: Joi.string().required(),
    role: Joi.string().required()
});


module.exports = memberSchema;