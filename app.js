require('dotenv').config();
require("./database/database").connect()
const express = require('express');

const app = express();
app.use(express.json());


app.get("/", (req,res)=>{
    res.send(`<h1>Server is running successfully</h1>`)
})

app.post("/register" ,async(req,res)=>{
    try {
        // get all the data form body or || url
        // all the data must be present
        // check if User already register
        // encrypt the password
        // Save the user in DB
        // Generate the token for user and send it 
        



    } catch (error) {
        console.log(error);
    }
})

module.exports = app;