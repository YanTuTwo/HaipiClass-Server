var mongoose=require('mongoose');

var penduserSchema=new mongoose.Schema({
    'puserid':String,    
    'password':String,
    'name':String,
    'sex':String,
    'lastlogin':String,
    'pendlist':Array
})
module.exports=mongoose.model("pendUsers",penduserSchema,'pendUsers');