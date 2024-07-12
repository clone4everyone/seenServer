const mongoose=require("mongoose");

const userSchema=new mongoose.Schema({
   id:{
    type:String
   },
   old:{
    type:Buffer,
    default:''
   },
   new:{
    type:Buffer,
    dafault:''
   },
   view:{
    type:Number,
    default:0
   },
  timestamp:{
    type:Date
  }
    

  
},{timestamps:true})


module.exports=mongoose.model("Users",userSchema);