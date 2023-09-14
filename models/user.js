const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    id:{
        type: String,
        unique: true,
        required: true
    },
    name:{
        type: String,
        maxLength: 64,
        default: null
    },
    email:{
        type: String,
        maxLength: 128,
        unique: true,
        lowercase: true,
        required: true
    },
    password:{
        type: String,
        maxLength: 64,
        required: true
    },
    created_at:{
        type: Date,
        immutable: true,
        default: Date.now
    }
});

module.exports = mongoose.model('User',userSchema);