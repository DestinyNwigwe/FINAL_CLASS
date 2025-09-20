const userModel = require("../models/user");
const bcrypt = require('bcrypt');
const cloudinary = require("../config/cloudinary");
const fs = require('fs');
const {sendMail}= require('../middleware/email');
const html = require("../middleware/signUp")

exports.register = async (req, res) => {
    try{
        console.log("i am a backend dev")
        const {fullName, email, age, password, phoneNumber} = req.body
        const file = req.file;
       let response;
        // we use file when we want to upload one image then we use files when we want to upload multiple images
        const existingEmail = await userModel.findOne({email: email.toLowerCase()});
        const existingPhoneNumber = await userModel.findOne({phoneNumber: phoneNumber});
        if(existingEmail || existingPhoneNumber) {
             fs.unlinkSync(file.path) 
            return res.status(400).json({
                messasge: 'User already exists'
            })
        }
        if(file && file.path){
            response = await cloudinary.uploader.upload(file.path)
            fs.unlinkSync(file.path) // to remove the file from the local storage
        }

        const saltRound = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, saltRound);

        const user = new userModel({
            fullName,
            email,
            password: hashPassword,
            age,
            phoneNumber,
            profilePicture:{
                publicId: response.public_id,
                imageUrl: response.secure_url
            }
        });
       
        await user.save()
        const subject= "kindly Verify Your Email";
        const link = `${req.protocol}://${req.get("host")}/api/v1/verify/${user_id  }`

        const text = `Hello ${fullName}, welcome to our app! Please verify your email. with the below link ${link}`
        console.log(email);
        await sendMail({
            to: email,
            subject,
            text,
            html: html(link, user,fullName)
        })
    // .then(()=>{
    //     console.log("mail sent")
    // }).catch((e)=>{
    //     console.log(e);

    res.status(201).json({
     message:"user created successfully",
     data: user
    });
    } 
catch(error) {
    console.log(500).json({
        message: "Internal server error",
        error: error.message
    });
    
    }
};


exports.getoneUser = async (req, res) => {
    try {
       const userId = req.params.id;
        const user = await userModel.findById(userId);
        if(!user) {
            return res.status(404).json({       
                message: 'User not found'
            });
        }
        res.status(200).json({
            message: 'User retrieved successfully',
            data: user
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            message: 'Internal Server Error',
            error: error.message
});
    }
};


exports.update = async(req,res)=>{
    try {
        const{fullName,age}= req.body
        const{id}=req.params
        const file = req.file;
        let response;
        const user = await userModel.findById(id);

        if(!user){
            return res.status(404).json("user not found")
        }

    if(file && file.path) {
        await cloudinary.uploader.destroy(user.profiePicture.publicId);
        response= await cloudinary.uploader.upload(file.path);
        fs.unlinkSync(file.path)
    }

    const userData = {
        fullName: fullName ?? user.fullName,
        age: age ?? user.age,
        profilePicture: {
            imageUrl: response?.secure_url,
            publicId:response ?.public_id,
        },
    };

    const newData= Object.assign(user, userData)
    const update = await userModel.findByIdAndUpdate(user._id, newData, {new: true});

     res.status(200).json({
        message: 'update successfully done',
        data: update
     })
    } catch (error) {
         console.log(error.message);
        res.status(500).json({
            message: 'Internal Server Error',
            error: error.message
    })
}
}

exports.delete = async(req,res)=>{
    try {
         const{fullName,age}= req.body
        const{id} = req.params
        const file = req.file;
        let response;
        const user = await userModel.findById(id);
        if(!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }
        if(file && file.path) {
            await cloudinary.uploader.destroy(user.publicId);
            response= await cloudinary.uploader.upload(file.path);
            fs.unlinkSync(file.path);
    }
     const userData = {
        fullName: fullName ?? user.fullName,
        age: age ?? user.age,
        profilePicture: {
            imageUrl: response?.secure_url,
            publicId:response ?.public_id,
        },

    };
       res.status(200).json({
            message: 'User deleted successfully',
            data: userData
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            message: 'Internal Server Error',
            error: error.message
        });
    }
}

exports.verifyUser = async(req, res)=>{
    try {
        const checkUser = await userModel.findById(req.params.id)
        if(!checkUser){
            return res.status(404).json({
                message: 'User not found'
            })
        }

        if(checkUser.isVerified){
            return res.status(400).json({
                message: "Email already verified"
            })
        }
        await userModel.findByIdAndUpdate(req.params.id, {isVerified: true}), {new: true}

        res.status(200).json({
            message: "Email successfully verified"
        })
    } catch (error) {
        res.status(500).json({
            message: 'Internal Server Error',
            error: error.message
        })
    }
}