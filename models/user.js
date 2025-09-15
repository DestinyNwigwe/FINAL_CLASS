const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    age:{
        type: Number,
        required: true
    },
    phoneNumber:{
        type: String,
        required: true,
        unique: true
    },
    profilePicture:{
        imageUrl:{
            type:String
        },
        publicId:{
            type: String, 
        }
    }
},{timestamps: true});

const userModel = mongoose.model('users', userSchema);

module.exports = userModel;
