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
    // phoneNumber:{
    //     type: String,
    //     required: true,
    //     unique: true
    // },
    isVerified:{
    type: String,
    required:true
    },
    token:{
        type: String,
        // required:true
    },
    profilePicture:{
        imageUrl:{
            type:String,
            required: true
        },
        publicId:{
            type: String, 
            required: true}
    }
},{timestamps: true});

const userModel = mongoose.model('users', userSchema);

module.exports = userModel;
