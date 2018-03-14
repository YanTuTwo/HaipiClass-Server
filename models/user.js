var mongoose=require('mongoose');

var userSchema=new mongoose.Schema({
    'userid':String,    
    'password':String,
    'nickname':String,
    'avatar':String,
    'age':Number,
    'sex':String,
    'intro':String,
    'collectList':Array,
    'playHistory':Array,
    'works':Array
})
module.exports=mongoose.model("Users",userSchema,'Users');