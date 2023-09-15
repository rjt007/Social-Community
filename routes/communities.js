const express = require('express');
const router = express.Router();
const Community = require('../models/community');
const User = require('../models/user');
const Member = require('../models/member');
const Role = require('../models/role');
const authorizeToken = require('../middlewares/authorizeToken');
const validate = require('../middlewares/validationMiddleware');
const paginationRules = require('../middlewares/paginationMiddleware');
const communitySchema = require('../validations/communityValidation');
const {Snowflake} = require('@theinternetfolks/snowflake');
const slugg = require('slug');


//Create a community
router.post('/', authorizeToken, validate(communitySchema), async(req,res)=>{
    try{
        const role = await Role.findOne({name: 'Community Admin'});
        const community = await Community.create({
            id: Snowflake.generate(),
            name: req.body.name,
            slug: slugg(req.body.name),
            owner: res.userId.id
        });
        await Member.create({
            id: Snowflake.generate(),
            community: community.id,
            user: res.userId.id,
            role: role.id
        });
        const data = await Community.findOne({id: community.id}, {_id: 0, __v: 0});
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

//Get all communities
router.get('/', paginationRules, async(req,res)=>{
    try{
        const {page, limit, startIndex} = res.rules;
        const total = await Community.countDocuments().exec();
        const pages = Math.ceil(total/limit);

        const communities = await Community.find({}, { _id: 0, __v: 0 })
        .limit(limit)
        .skip(startIndex)
        .exec();
    
        const userPromises = communities.map(async(ele) => {
            const user = await User.findOne({ id: ele.owner }, { id: 1, name: 1, _id: 0 });
            ele.owner = user;
            return ele;
        });
      
        const data = await Promise.all(userPromises);

        const response = {
            status: true,
            content: {
                meta: {
                    total: total,
                    pages: pages,
                    page: page
                }
            },
            data: data
        };
        res.status(200).json(response);
    }
    catch(err){
        res.status(500).json({message:err.message});
    }
});

//Get all members of a community
router.get('/:id/members', paginationRules, async(req,res)=>{
    const id = req.params.id;
    if(id==null){
        return res.status(400).json({message: 'error! invalid community'});
    }
    try{
        const {page, limit, startIndex} = res.rules;
        const community = await Community.findOne({slug: id});

        const total = await Member.countDocuments({community: community.id}).exec();
        const pages = Math.ceil(total/limit);

        const members = await Member.find({community: community.id},{__v: 0, _id: 0})
        .limit(limit)
        .skip(startIndex)
        .exec();

        const promises = members.map(async(ele) => {
            const user = await User.findOne({ id: ele.user }, { id: 1, name: 1, _id: 0 });
            const role = await Role.findOne({ id: ele.role }, { id: 1, name: 1, _id: 0 });
            ele.user = user;
            ele.role = role;
            return ele;
        });
      
        const data = await Promise.all(promises);

        const response = {
            status: true,
            content: {
                meta: {
                    total: total,
                    pages: pages,
                    page: page
                }
            },
            data: data
        };
        res.status(200).json(response);
    }
    catch(err){
        res.status(500).json({message:err.message});
    }
});

//Get a user owned community
router.get('/me/owner', authorizeToken, paginationRules, async(req,res)=>{
    try{
        const {page, limit, startIndex} = res.rules;
        const total = await Community.countDocuments({owner: res.userId.id}).exec();
        const pages = Math.ceil(total/limit);

        const communities = await Community.find({owner: res.userId.id},{__v: 0, _id: 0})
        .limit(limit)
        .skip(startIndex)
        .exec();

        const response = {
            status: true,
            content: {
                meta: {
                    total: total,
                    pages: pages,
                    page: page
                }
            },
            data: communities
        };
        res.status(200).json(response);
    }
    catch(err){
        res.status(500).json({message:err.message});
    }
});

//Get the list of communities joined by a user
router.get('/me/member', authorizeToken, paginationRules, async(req,res)=>{
    try{
        const {page, limit, startIndex} = res.rules;
        const role = await Role.findOne({name: 'Community Member'});

        const total = await Member.countDocuments({user: res.userId.id, role: role.id}).exec();
        const pages = Math.ceil(total/limit);

        const members = await Member.find({user: res.userId.id, role: role.id})
        .limit(limit)
        .skip(startIndex)
        .exec();

        const communityPromises = members.map(async(ele) => {
            const community = await Community.findOne({ id: ele.community }, {_id: 0, __v: 0});
            return community;
        });
        const communities = await Promise.all(communityPromises);

        const userPromises = communities.map(async(ele) => {
            const user = await User.findOne({ id: ele.owner }, { id: 1, name: 1, _id: 0 });
            ele.owner = user;
            return ele;
        });
        const data = await Promise.all(userPromises);
        const response = {
            status: true,
            content: {
                meta: {
                    total: total,
                    pages: pages,
                    page: page
                }
            },
            data: data
        };
        res.status(200).json(response);
    }
    catch(err){
        res.status(500).json({message:err.message});
    }
});

module.exports = router;