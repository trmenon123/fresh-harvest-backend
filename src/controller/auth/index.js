const { authServices }= require('../../services');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const config = require('config');


// Create User [CONTROLLER]
const createUser = async (req,res)=> {
    const userQuery = await authServices.getUserByEmail(req?.body?.email);
    try{
        if(userQuery?.exist== true) {
            res.status(200).json({success: true, message:"User already Exist", data: userQuery?.data});            
        }
        if(userQuery?.exist== false) {
            // Call to create new user            
            const data = {...req.body,imageUrl:"DEFAULT"};            
            const newUser = await authServices.createNewUser(data);
            res.status(200).json({success: true, message: "New user created", data: newUser});
        }
    }catch(err){
        res.status(200).json({success: false, message: "Call not acheived", data: {}});
    }
};

// User Signin [CONTROLLER]
const signin = async(req, res)=> {
    const userQuery = await authServices.getUserByEmail(req.body?.email);
    try{
        if(userQuery?.exist== false) {
            res.status(200).json({
                success: true, 
                message: "User not registered", 
                data: {}
            });
        }
        if(userQuery?.exist== true) {
            // Getting encrypted password 
            const validpassword = await bcrypt.compare(
                req.body?.password,
                userQuery?.data?.password
            );
            if(validpassword) {
                // JWT Authentication
                const secret = config.get("jwt.secret");
                const token = jwt.sign(
                    {_id: userQuery?.data._id},
                    secret,
                    {expiresIn: '1d'}
                );
                res.cookie('token', token, {expiresIn:'1d'});
                res.status(200).json({
                    success: true, 
                    message: "Signin success", 
                    data: userQuery?.data, 
                    token
                });
            }else {
                res.status(200).json({
                    success: false, 
                    message: "Incorrect Password", 
                    data: {}
                });
            }                  
        }
    }catch(err){
        console.log("[ERROR] User Signin terminated");
        console.log(err);   
        res.status(200).json({
            success: false, 
            message: "API failed", 
            data: {}
        });     
    }
};

// User Signout [CONTROLLER]
const signout = (req, res)=> {
    res.clearCookie('token');
    res.json({
        success: true,
        message: "Signout success"
    });
};

// Middleware
const requireSignin= expressJwt({
    secret: config.get("jwt.secret"),
    algorithms: ["HS256"], // added later
    userProperty: "auth",
});

module.exports= {
    createUser,
    signin,
    signout,
    requireSignin
}