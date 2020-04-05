const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
    name : {
        type: String,
        required: true
    },
    email : {
        type: String,
        unique:true,
        required: true
    },
    password : {
        type: String,
        required: true
    },
    createdOn : {
        type: Date,
        default: Date.now
    },
    dob : {
        type:String
    },
    contact : {
        type: Number
    }
});

module.exports = User = mongoose.model('users', UserSchema)