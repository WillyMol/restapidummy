//this is function to send post request to a device (a Thing)
const axios = require('axios').default;

var postReqToDev = function (post_Ip,req_body_State) {     
    axios.post(post_Ip, { "State" : req_body_State })
    .then((dev_response) => {        
        console.log(dev_response.data);
    })
    .catch((err) => {
        console.log({ "message" : err.response.data });             
    });       
};

module.exports = postReqToDev;

/* function postReqToDev(post_Ip,req_body_State) {     
    axios.post(post_Ip, { "State" : req_body_State })
    .then((dev_response) => {        
        console.log(dev_response.data);
    })
    .catch((err) => {
        console.log({ "message" : err.response.data });             
    });       
};
 */