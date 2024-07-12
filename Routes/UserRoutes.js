const UserRoutes=require('express').Router();
const {upload,tracking}=require('../controller/UserController.js')

UserRoutes.post("/upload",upload);
UserRoutes.get("/tracking-image",tracking);
module.exports=UserRoutes