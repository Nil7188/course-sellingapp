import express from  "express";
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import { v2 as cloudinary } from 'cloudinary';
import courseRoute from './Routes/course.route.js'
import userRoute from './Routes/user.route.js'
import adminRoute from './Routes/admin.routes.js'
import cors from 'cors'
import fileUpload from "express-fileupload";
import cookieParser from "cookie-parser";
const app = express()
dotenv.config()

app.use(express.json());
app.use(cookieParser());
app.use(fileUpload({
    useTempFiles:true,
    tempFileDir:"/tmp/"
}))

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174"
];

app.use(cors({
  origin: function(origin, callback){
    if(!origin || allowedOrigins.includes(origin)){
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

const port = process.env.PORT || 3000;
const DB_URI = process.env.MONGO_URI


try{
   mongoose.connect(DB_URI)
  console.log("Connected to MongoDB")

}catch(err){
  console.log(err)
}

//define routes
app.use("/api/v1/course",courseRoute)
app.use("/api/v1/user",userRoute)
app.use("/api/v1/admin",adminRoute)

cloudinary.config({ 
        cloud_name: process.env.cloud_name, 
        api_key: process.env.api_key, 
        api_secret: process.env.api_secret
      });





app.listen(port, () => {
  console.log(`Server is running on port  ${port}`)
})

