require('dotenv').config();
require("./database/database").connect()
const User = require("./model/user")
const express = require('express');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

const app = express();
app.use(express.json());
app.use(cookieParser())


app.get("/", (req,res)=>{
    res.send(`<h1>Server is running successfully</h1>`)
})

app.post("/register" ,async(req,res)=>{
    try {
        // get all the data form body or || url
        const { firstName , lastName , email , password } = req.body;

        // all the data must be present
        if(!(firstName && lastName && email && password)){
            res.status(400).send(`All fields are required`)
        }

        // check if User already register
        const existingUser = await User.findOne({email })
        if(existingUser){
            res.status(401).send(`User Already exists with this email`)
        }

        // encrypt the password
        const encryptedpassword = await bcrypt.hash(password , 10 )
        
        // Save the user in DB
        const user = await User.create({
            firstName,
            lastName,
            email,
            password:encryptedpassword
        })

        // Generate a token for user and send it 
        // Token using JWT
        const token = jwt.sign(
            {id : user._id ,email :user.email},
            'mysecretkey', // process.env
            {
                expiresIn:"2h"
            }
        )

        user.token = token
        user.password = undefined

        req.status(201).json(user);

    } catch (error) {
        console.log(error);
    }
})

app.post("/login",async(req,res)=>{
    try {
        // get all the data from user
        const { email , password } = req.body
        // check the fields
        if(!(email && password)){
            res.status(401).send(`All the fields are required !`)
        }
        // find the user in DB
        let user = await User.findOne(email)

        if(!user){
            res.status(401).send(`User doesnot exist in the database! Sign in first`)
        }

        // Match the password
        // await bcrypt.compare(password , user.password)

        if(user && (await bcrypt.compare(password , user.password))){
            const token = jwt.sign(
                {id : user._id},
                'mysecretkey', // process.env.jwt_secret
                {
                    expiresIn:"2h"
                }
            );

            user.token = token;
            user.password = undefined;
        
            // send token in user cookie
            // cookie section
            const options = {
                expires : new Date(Date.now() + 3*24*60*60*1000),
                httpOnly : true
            };
            res.status(200).cookie("token",token , options).json({
                success:true,
                token,
                user
            })
        }
        


    } catch (error) {
        console.log(error);
    }
})

module.exports = app;