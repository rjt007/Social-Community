require('dotenv').config();
const express = require('express');
const router = express.Router();
const User = require('../models/user');
const validate = require('../middlewares/validationMiddleware');
const {Snowflake} = require('@theinternetfolks/snowflake');
const bcrypt = require('bcrypt');
const {userSignUpSchema, userSignInSchema} = require('../validations/userValidation');
const jwt = require('jsonwebtoken');

//Create a User
router.post('/signup', validate(userSignUpSchema), async(req,res)=>{
    const {name, email, password} = req.body;
    const id = Snowflake.generate();
    const hashedPassword = await bcrypt.hash(password,10);
    try{
        await User.create({
            id: id,
            name: name,
            email:  email,
            password: hashedPassword
        });
        const user = await User.findOne({id: id}, {_id: 0, __v: 0, password: 0});
        const userId = {id: user.id};
        const access_token = jwt.sign(userId, process.env.ACCESS_TOKEN_SECRET);
        const response = {
            status: true,
            content: {
                data: user
            },
            meta: {
                access_token: access_token
            }
        };
        res.status(201).json(response);
    }
    catch(err){
        res.status(500).json({message:err.message});
    }
});

//Authenticate User
router.post('/signin', validate(userSignInSchema), async(req,res)=>{
    const {email, password} = req.body;
    try{
        const user = await User.findOne({email: email},{_id: 0, __v: 0});
        if(user==null){
            return res.status(400).json({message:'Error! Enter a valid email.'});
        }
        else if(!(await bcrypt.compare(password,user.password))){
            return res.status(400).json({message:'Error! Password entered is wrong.'});
        }
        else{
            user.password = undefined;
            const userId = {id: user.id};
            const access_token = jwt.sign(userId, process.env.ACCESS_TOKEN_SECRET);
            const response = {
                status: true,
                content: {
                    data: user
                },
                meta: {
                    access_token: access_token
                }
            };
            return res.status(200).json(response);
        }
    }
    catch(err){
        res.status(500).json({message:err.message});
    }
});

module.exports = router;