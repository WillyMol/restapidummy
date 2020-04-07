const express = require ('express');
const router = express.Router();
const Post = require('../models/Post');
//const axios = require('axios').default;
var postReqToDev = require('./axios_post_req.js');

// 1) Getting all Things attributes from mongoDB
router.get('/', async (req,res) => {
    try {        
        const posts = await Post.find();                                      
        res.json(posts);
    } catch(err){ 
        //500 means something has gone wrong on the web site's server
        res.status(500).json({ message : err.message });
    }
});

//2) getting One. (a Thing) from mongoDB
router.get('/:postId', getPost, async (req,res) =>{
    res.json(res.post);
});
// 3) Creating one. Add a new Thing to mongoDB
router.post('/', async (req,res) => {    
    const post = new Post({
        Name: req.body.Name,
        Ip: req.body.Ip,
        Description: req.body.Description,
        State: req.body.State
    });
    try{
        const savedPost =  await post.save();
        res.status(201).json(savedPost);
        } catch(err){
            res.status(400).json({ message : err.message });
        }
});

// 4) Updating One. (a Thing) any attribute in mongoDB
router.patch('/:postId', getPost, async (req,res) =>{    
    if(req.body.Name != null){
        res.post.Name = req.body.Name;
    } else if(req.body.Ip != null){
        res.post.Ip = req.body.Ip;
    } else if(req.body.Description != null){
        res.post.Description = req.body.Description;
    } else if(req.body.State != null){
        res.post.State = req.body.State;             		
        postReqToDev(post.Ip, req.body.State);         
    } else {  //404 means request not found
        return res.status(404).json({ 
            message : 'Cannot Find Argument(s) of Device'
        }); 
    }
    try {
        const updatedpost = await res.post.save()
        res.json(updatedpost);
    } catch (err) {
        res.status(400).json({ message : err.message });        
    }
});

// 5) Deleting One specific _id from mongoDB
router.delete('/:postId', getPost, async (req,res) =>{
    try {
        await res.post.remove();
        res.json({ message : 'Deleted post' });
        
    } catch (err) {
        res.status(500).json({ message : err.message });
    }

});

//This is a middleware: Look for arguments of device 
//(in the database) by the _id (passed by URL) if success 
//then pass them to a variable post (defined by let) 
async function getPost(req,res,next){
    let post;
    try {
        post = await Post.findById(req.params.postId);
        if (post == null){ //404 means request not found
            return res.status(404).json({
                message : 'Cannot Find Id Of Device'
            }); 
        }
        
    } catch (err) {
        return res.status(500).json({ message : err.message });
    }

    res.post = post; 
    next();
}

module.exports = router;