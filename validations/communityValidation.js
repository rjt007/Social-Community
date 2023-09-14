const Joi = require('joi');

const communitySchema = Joi.object({
    name: Joi.string().min(2).max(128).required()
});


module.exports = communitySchema;