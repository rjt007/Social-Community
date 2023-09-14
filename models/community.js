const mongoose = require('mongoose');

const communitySchema = mongoose.Schema({
    id:{
        type: String,
        required: true,
        unique: true
    },
    name:{
        type: String,
        maxLength: 128,
        required: true,
    },
    slug:{
        type: String,
        maxLength: 255,
        unique: true,
        required: true
    },
    owner:{
        type: String,
        ref: 'User',
        required: true
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

module.exports = mongoose.model('Community',communitySchema);
