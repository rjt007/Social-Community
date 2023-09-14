const mongoose = require('mongoose');

const memberSchema = mongoose.Schema({
    id:{
        type: String,
        required: true,
        unique: true
    },
    community:{
        type: String,
        ref: 'Community',
        required: true
    },
    user:{
        type: String,
        ref: 'User',
        required: true
    },
    role:{
        type: String,
        ref: 'Role',
        required: true
    },
    created_at:{
        type: Date,
        immutable: true,
        default: Date.now
    }
});

module.exports = mongoose.model('Member', memberSchema);