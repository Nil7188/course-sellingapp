import express from  "express";
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import { v2 as cloudinary } from 'cloudinary';
import courseRoute from './Routes/course.route.js'
import userRoute from './Routes/user.route.js'
import fileUpload from "express-fileupload";
const app = express()
dotenv.config()

app.use(express.json());
app.use(fileUpload({
    useTempFiles:true,
    tempFileDir:"/tmp/"
}))

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

cloudinary.config({ 
        cloud_name: process.env.cloud_name, 
        api_key: process.env.api_key, 
        api_secret: process.env.api_secret
      });





app.listen(port, () => {
  console.log(`Server is running on port  ${port}`)
})

