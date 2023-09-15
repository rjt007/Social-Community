const express = require('express');
const router = express.Router();
const Role = require('../models/role');
const {Snowflake} = require('@theinternetfolks/snowflake');
const validate = require('../middlewares/validationMiddleware');
const roleSchema = require('../validations/roleValidation');
const paginationRules = require('../middlewares/paginationMiddleware');

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
router.get('/', paginationRules, async(req,res)=>{
    try{
        const {page, limit, startIndex} = res.rules;
        const total = await Role.countDocuments().exec();
        const pages = Math.ceil(total/limit);
        const roles = await Role.find({},{_id: 0, __v: 0}).limit(limit).skip(startIndex).exec();
        const response = {
            status: true,
            content: {
                meta: {
                    total: total,
                    pages: pages,
                    page: page
                }
            },
            data: roles
        };
        res.status(200).json(response);
    }
    catch(err){
        res.status(500).json({message:err.message});
    }
})

module.exports = router;