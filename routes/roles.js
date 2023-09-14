const express = require('express');
const router = express.Router();
const Role = require('../models/role');
const {Snowflake} = require('@theinternetfolks/snowflake');
const validate = require('../middlewares/validationMiddleware');
const roleSchema = require('../validations/roleValidation');
const paginatedResults = require('../middlewares/paginatedResults');

//Create a New Role
router.post('/', validate(roleSchema), async(req,res)=>{
    const name = req.body.name;
    const id = Snowflake.generate();
    try{
        await Role.create({
            name: name,
            id: id
        });
        const role = await Role.findOne({id: id}, {_id: 0, __v: 0});
        res.status(201).json(role);
    }
    catch(err){
        res.status(500).json({message:err.message});
    }
});

//Get all the Roles
router.get('/', paginatedResults(Role), async(req,res)=>{
    try{
        const roles = res.results;
        res.status(200).json(roles);
    }
    catch(err){
        res.status(500).json({message:err.message});
    }
})

module.exports = router;