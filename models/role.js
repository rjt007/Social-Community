const mongoose = require('mongoose');

const roleSchema = mongoose.Schema({
    id:{
        type: String,
        unique: true,
        required: true
    },
    name:{
        type: String,
        maxLength: 64,
        required: true,
        unique: true
    },
    created_at:{
        type: Date,
        immutable: true,
        default: Date.now
    },
    updated_at:{
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Role',roleSchema);
