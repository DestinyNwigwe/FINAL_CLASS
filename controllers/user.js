const userModel = require('../models/user');

const bcrypt = require('bcrypt');

exports.register = async (req, res) => {
    try{
        const{fullName, email, password, age, phoneNumber} = req.body;
        const existingEmail = await userModel.findOne({email: email.toLowerCase()});
        const existingPhoneNumber = await userModel.findOne({phoneNumber:phoneNumber});

        if(existingEmail || existingPhoneNumber){
            return res.status(400).json({message: "User already exists"});
        };

        const saltRound = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, saltRound);

        const user = new userModel({
            fullName,
            email: email.toLowerCase(),
            password: hashPassword,
            age,
            phoneNumber,
        });
        await user.save();
        res.status(201).json({
            message: "User registered successfully",
            data: user
    });
    } catch(err){
        res.status(500).json({message: "Internal Server error", error: err.message});
    }
};

exports.getOne = async (req, res) => {
    try {
        const {id: _id} = req.params
        const user = await userModel.findOne({_id});
        if(!user){
            return res.status(404).json({
                message: `User with id ${_id} not found`
            })
        }
        res.status(200).json({
            message: 'User',
            data: user
        })
    } catch (error) {
        res.status(500).json({
            message: 'Internal Server Error',
            error: error.message
        })
    }   
};

exports.getAll = async (req, res) => {
    try {
        const users = await userModel.find();
        res.status(200).json({
            message: "All users below",
            total: users.length,
            data: users
        })
    } catch (error) {
        res.status(500).json({
            message: 'Internal Server Error',
            error: error.message
        })
    }
}