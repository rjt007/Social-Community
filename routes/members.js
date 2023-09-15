const express = require('express');
const router = express.Router();
const Community = require('../models/community');
const Member = require('../models/member');
const authorizeToken = require('../middlewares/authorizeToken');
const validate = require('../middlewares/validationMiddleware');
const memberSchema = require('../validations/memberValidation');
const {Snowflake} = require('@theinternetfolks/snowflake');

//Add a member in a community
router.post('/', authorizeToken, validate(memberSchema), async(req,res)=>{
    const {community, user, role} = req.body;
    try{
        const communityData = await Community.findOne({id: community});
        if(res.userId.id!==communityData.owner){
            return res.status(403).json({message: 'NOT_ALLOWED_ACCESS'});
        }
        const member = await Member.create({
            id: Snowflake.generate(),
            community: community,
            user: user,
            role: role
        });
        const data = await Member.findOne({id: member.id},{_id: 0, __v: 0});
        const response = {
            status: true,
            content: {
                data: data
            }
        };
        res.status(201).json(response);
    }
    catch(err){
        res.status(500).json({message:err.message});
    }
});

//Remove a member from community
router.delete('/:id', authorizeToken, async(req,res)=>{
    const id = req.params.id;
    if(id==null){
        return res.status(400).json({message: 'error! invalid member'});
    }
    try{
        const member = await Member.findOne({id: id});
        const community = await Community.findOne({id: member.community});
        if(res.userId.id!==community.owner){
            return res.status(403).json({message: 'NOT_ALLOWED_ACCESS'});
        }
        await Member.deleteOne({id: id});
        res.status(201).json({status:true});
    }
    catch(err){
        res.status(500).json({message:err.message});
    }
});

module.exports = router;