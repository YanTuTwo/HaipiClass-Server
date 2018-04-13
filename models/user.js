var mongoose=require('mongoose');

var userSchema=new mongoose.Schema({
    'userid':String,    
    'password':String,
    'nickname':String,
    'avatar':String,
    'age':Number,
    'sex':String,
    'intro':String,
    'wyCollect':Array,
    'hpCollect':Array,
    'voteHistory':Array,
    'playHistory':Array,
    'notice':Array,
    'works':Array
})
module.exports=mongoose.model("Users",userSchema,'Users');