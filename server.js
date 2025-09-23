require('dotenv').config();
const express= require('express');
const PORT = process.env.PORT || 3000;
const mongoose = require('mongoose')
const cors = require('cors')
const jwt = require('jsonwebtoken')

const DB_URI = process.env.DB_URI

const userRouter = require('./routes/user');

const productRoutes = require('./routes/productRoute');
const { JsonWebTokenError, verify } = require('jsonwebtoken');



const app = express();
app.use(express.json());
app.use( cors())

app.use('/api/v1', userRouter)
app.use('/api/v1', productRoutes)



// res.send("checking token")
// const token = req.headers.authorization (" ")[1]
// jwt.verify(token, "daniel", (err)=>{
//     if (err) {
//         return res.status(400).json({err:err.message})
//     }
// })
// console.log(token);


app.use((error,req,res,next) =>{
    if(error) {
        return res.status(500).json({
            message: error.message
        })
    };
    next()
})


mongoose.connect(DB_URI).then(() => {
    console.log("DB connection successful");
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    })
}).catch((err) => {
    console.log("DB connection error: ", err);
})