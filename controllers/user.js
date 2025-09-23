const userModel = require("../models/user");
const bcrypt = require('bcrypt');
const cloudinary = require("../config/cloudinary");
const fs = require('fs');
const {sendMail}= require('../middleware/email');
const jwt = require("jsonwebtoken")
const html = require("../middleware/signUp");
const {forgethtml} = require("../middleware/signUp")
const { error } = require("console");

exports.register = async (req, res) => {
    try {
        console.log("i am a backend dev"); // Debug log
        const { fullName, email, age, password, phoneNumber } = req.body; // Destructure data from request body
        const file = req.file; // Get uploaded file (single image)

        let response; // To hold cloudinary upload response

        // Check if email already exists
        const existingEmail = await userModel.findOne({ email: email.toLowerCase() });

        // Check if phone number already exists
        const existingPhoneNumber = await userModel.findOne({ phoneNumber: phoneNumber });

        // If user exists, delete uploaded image and return error
        if (existingEmail || existingPhoneNumber) {
            fs.unlinkSync(file.path); // Remove uploaded image from local storage
            return res.status(400).json({
                message: "This user already exists"
            });
        }

        // If image is uploaded, upload to cloudinary and remove from local storage
        if (file && file.path) {
            response = await cloudinary.uploader.upload(file.path);
            fs.unlinkSync(file.path);
        }

        // Hash the password
        const saltRound = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, saltRound);

        // Create new user object
        const user = new userModel({
            fullName,
            email,
            password: hashPassword,
            age,
            phoneNumber,
            profilePicture: {
                publicId: response.public_id,
                imageUrl: response.secure_url
            }
        });

        await user.save(); // Save user to database

        // Create email verification link
        const subject = "kindly Verify Your Email";
        const link = `${req.protocol}://${req.get("host")}/api/v1/verify/${user._id}`; 

        // const text = `Hello ${fullName}, welcome to our app! Please verify your email with the below link ${link}`;
        // console.log(email);

        // Send verification email
        await sendMail({
            to: email,
            subject,
            text,
            html: html(link, user.fullName)
        });

        res.status(201).json({
            message: "user created successfully",
            data: user
        });

    } catch (error) {
        res.status(500).json({ 
            message: "Internal server error",
            error: error.message
        });
    }
}

exports.login = async(req,res)=>{
    try {
        const {email,password}= req.body

        // Find user by email
        const checkUser = await userModel.findOne({email: email.toLowerCase().trim()});

        if(!checkUser){
            return res.status(400).json({
                message: "Email not found"
            })
        }

        // Compare entered password with hashed password
        const checkPassword = await bcrypt.compare(password, checkUser.password)

        if(!checkPassword){
            return res.status(400).json({
                message: "incorrect password"
            })
        }

        
        if(!checkUser || checkPassword){
            return res.status(400).json({
                measage: "Bad request"
            })
        }

        //This is for Generating JWT token
        const token = jwt.sign({id: checkUser._id}, "Dsmart", {expiresIn:"1m"}) 

        // This is for Sending success response
        res.status(200).json({
            message: "You be yoruba boy login successfully",
            data: checkUser,
            token
        })  
    } catch (error) {
        res.status(500).json({
            message: "Internal Server error",
            error: error.message
        })
    }
}





exports.home = async(req,res)=>{
    try {
        // Check for token in request header
        const checkToken = req.headers.authorization
        if(!checkToken){
            return res.status(400).json("Login required")
        }

      //this is when you want to split the token by using slice
        const token = req.headers.authorization.split(" ")[1]

        // This is for Verifying token
        jwt.verify(token, "daniel", async(err, result)=>{
            if(err){
                return res.status(400).json({error: err.message})
            } else{
                const checkUser = await userModel.findById(result.id)

                // Respond with welcome message
                res.status(200).json(`welcome ${checkUser.fullName}, we are happy to have you here`)
            }
        })
    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        })
    }
}
// forget password

exports.forgetPassword = async(req,res)=>{
  try {
    const {email} = req.body

    // Find user by email
    const user = await userModel.findOne({email: email.toLowerCase()})

    if(!user){
        return res.status(404).json({
            message: "Email not found"
        })
    }

    const subject = 'Forget password'

   //This is for creating a link that will make the user to get his/her password through email
    const token = jwt.sign({id: user._id}, "destiny", {expiresIn: "1m"})

    const link = `${req.protocol}://${req.get("host")}/api/v1/forget-password/${token}`

    // Send forget password email
    await sendMail({
        to: email,
        subject,
        html: forgethtml(link, user.fullName)
    })

    res.status(200).json({
        message: 'Kindly check your mail for instructions',
        data: user
    })

  } catch (error) {
    res.status(500).json({
        message: "Internal Server error",
        error: error.message
    }) 
  }
}


exports.changePassword = async(req, res) => {
    try {
        // Destructure new and confirm password from request body
        const { newPassword, confirmPassword } = req.body;

        //we are trying to set a condition that if new password is not strictly eqaul to confirm password it should return a 400 request
        if (newPassword !== confirmPassword) {
            return res.status(400).json({
                message: "Password does not match"
            });
        }

        // Generate a salt for hashing
        const salt = await bcrypt.genSalt(10);

        // Hash the confirmed password (could also use newPassword — they are equal by now)
        const hash = await bcrypt.hash(confirmPassword, salt);

        // Find the user by ID (passed in URL param)
        const user = await userModel.findById(req.params.id);

        
        jwt.verify(user.token, "suliya", async (err, result) => {

            // If token is invalid or expired
            if (err) {
                return res.status(400).json({
                    message: "Email expired"
                });
            } else {
                // If token is valid, update user's password and remove the token
                await userModel.findByIdAndUpdate(result.id, {
                    password: hash,
                    token: null // Clear the token so it can't be reused
                }, { new: true });

                // Send success response
                res.status(200).json({
                    message: "Password successfully changed"
                });
            }
        });
    } catch (error) {
        // Handle unexpected errors
        res.status(500).json({
            message: "Internal server error"
        });
    }
};















// exports.getoneUser = async (req, res) => {
//     try {
//        const userId = req.params.id;
//         const user = await userModel.findById(userId);
//         if(!user) {
//             return res.status(404).json({       
//                 message: 'User not found'
//             });
//         }
//         res.status(200).json({
//             message: 'User retrieved successfully',
//             data: user
//         });
//     } catch (error) {
//         console.log(error.message);
//         res.status(500).json({
//             message: 'Internal Server Error',
//             error: error.message
// });
//     }
// };


// exports.update = async(req,res)=>{
//     try {
//         const{fullName,age}= req.body
//         const{id}=req.params
//         const file = req.file;
//         let response;
//         const user = await userModel.findById(id);

//         if(!user){
//             return res.status(404).json("user not found")
//         }

//     if(file && file.path) {
//         await cloudinary.uploader.destroy(user.profiePicture.publicId);
//         response= await cloudinary.uploader.upload(file.path);
//         fs.unlinkSync(file.path)
//     }

//     const userData = {
//         fullName: fullName ?? user.fullName,
//         age: age ?? user.age,
//         profilePicture: {
//             imageUrl: response?.secure_url,
//             publicId:response ?.public_id,
//         },
//     };

//     const newData= Object.assign(user, userData)
//     const update = await userModel.findByIdAndUpdate(user._id, newData, {new: true});

//      res.status(200).json({
//         message: 'update successfully done',
//         data: update
//      })
//     } catch (error) {
//          console.log(error.message);
//         res.status(500).json({
//             message: 'Internal Server Error',
//             error: error.message
//     })
// }
// }

// exports.delete = async(req,res)=>{
//     try {
//          const{fullName,age}= req.body
//         const{id} = req.params
//         const file = req.file;
//         let response;
//         const user = await userModel.findById(id);
//         if(!user) {
//             return res.status(404).json({
//                 message: 'User not found'
//             });
//         }
//         if(file && file.path) {
//             await cloudinary.uploader.destroy(user.publicId);
//             response= await cloudinary.uploader.upload(file.path);
//             fs.unlinkSync(file.path);
//     }
//      const userData = {
//         fullName: fullName ?? user.fullName,
//         age: age ?? user.age,
//         profilePicture: {
//             imageUrl: response?.secure_url,
//             publicId:response ?.public_id,
//         },

//     };
//        res.status(200).json({
//             message: 'User deleted successfully',
//             data: userData
//         });
//     } catch (error) {
//         console.log(error.message);
//         res.status(500).json({
//             message: 'Internal Server Error',
//             error: error.message
//         });
//     }
// }

// exports.verifyUser = async(req, res)=>{
//     try {
//         const checkUser = await userModel.findById(req.params.id)
//         if(!checkUser){
//             return res.status(404).json({
//                 message: 'User not found'
//             })
//         }

//         if(checkUser.isVerified){
//             return res.status(400).json({
//                 message: "Email already verified"
//             })
//         }
//         await userModel.findByIdAndUpdate(req.params.id, {isVerified: true}), {new: true}

//         res.status(200).json({
//             message: "Email successfully verified"
//         })
//     } catch (error) {
//         res.status(500).json({
//             message: 'Internal Server Error',
//             error: error.message
//         })
//     }
// }