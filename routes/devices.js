const express = require ('express');
const router = express.Router();
const Device = require('../models/device');
//const axios = require('axios').default;
var postReqToDev = require('./axios_post_req.js');

// 1) Getting all Things attributes from mongoDB
router.get('/', async (req,res) => {
    try {        
        const devices = await Device.find();                                      
        res.json(devices);
    } catch(err){ 
        //500 means something has gone wrong on the web site's server
        res.status(500).json({ message : err.message });
    }
});
//tytyty
//2) getting One. (a Thing) from mongoDB
router.get('/:deviceId', getDevice, async (req,res) =>{
    res.json(res.device);
});
// 3) Creating one. Add a new Thing to mongoDB
router.post('/', async (req,res) => {    
    const device = new Device({
        Name: req.body.Name,
        Ip: req.body.Ip,
        Description: req.body.Description,
        State: req.body.State
    });
    try{
        const savedDevice =  await device.save();
        res.status(201).json(savedDevice);
        } catch(err){
            res.status(400).json({ message : err.message });
        }
});

// 4) Updating One. (a Thing) any attribute in mongoDB
router.patch('/:deviceId', getDevice, async (req,res) =>{    
    if(req.body.Name != null){
        res.device.Name = req.body.Name;
    } else if(req.body.Ip != null){
        res.device.Ip = req.body.Ip;
    } else if(req.body.Description != null){
        res.device.Description = req.body.Description;
    } else if(req.body.State != null){
        res.device.State = req.body.State;             		
        postReqToDev(device.Ip, req.body.State);         
    } else {  //404 means request not found
        return res.status(404).json({ 
            message : 'Cannot Find Argument(s) of Device'
        }); 
    }
    try {
        const updatedDevice = await res.device.save()
        res.json(updatedDevice);
    } catch (err) {
        res.status(400).json({ message : err.message });        
    }
});

// 5) Deleting One specific _id from mongoDB
router.delete('/:deviceId', getDevice, async (req,res) =>{
    try {
        await res.device.remove();
        res.json({ message : 'Deleted device' });
        
    } catch (err) {
        res.status(500).json({ message : err.message });
    }

});

//This is a middleware: Look for arguments of device 
//(in the database) by the _id (passed by URL) if success 
//then pass them to a variable "device" (defined by let) 
async function getDevice(req,res,next){
    let device;
    try {
        device = await Device.findById(req.params.deviceId);
        if (device == null){ //404 means request not found
            return res.status(404).json({
                message : 'Cannot Find Id Of Device'
            }); 
        }
        
    } catch (err) {
        return res.status(500).json({ message : err.message });
    }

    res.device = device; 
    next();
}

module.exports = router;