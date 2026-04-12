import {Course} from "../models/course.model.js";
import { v2 as cloudinary } from 'cloudinary';


export const createCourse =async (req,res)=>{

    const {title,description,price}=req.body;
    console.log(title,description,price);

    try{
        if(!title || !description || !price){
            return res.status(400).json({message:"All fields are required"});
    }
    const  {image} = req.files
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({ message: 'No files were uploaded.' });


    }
    const allowedFormats = ['image/jpg','image/jpeg','image/png']
    if(!allowedFormats.includes(image.mimetype)){
        return res.status(400).json({error:"Invalid file format. Only PNG, JPG and JPEG are allowed."});

    }

    //cloudinary code
    const cloud_response=await cloudinary.uploader.upload(image.tempFilePath)
    if(!cloud_response || cloud_response.error){
        return res.status(400).json({error:"Image upload failed"});

    }


    const courseData={
        title,
        description,
        price,
        image:{
            public_id:cloud_response.public_id,
            url:cloud_response.secure_url,
        },
    }
    await Course.create(courseData);
    res.json({
        message:"Course created successfully",
        course:courseData
    });


}
    catch(err){
        console.log(err);
        res.status(500).json({error:"Error creating course"});
    }
}

export const updateCourse=async(req,res)=>{
    const {courseId}=req.params;
    const {title,description,price,image}=req.body;

    try{

        const course=await Course.updateOne({
            _id:courseId
        },{
            title,
            description,
            price,
            image: {
                public_id: image?.public_id,
                url: image?.url ,
            }
        })
        res.status(201).json({message:"Course updated successfully"});
     } catch(err){
        res.status(500).json({error:"Error in updating course"});
        console.log("error in course updating",err);
     }
    
}

export const deleteCourse=async(req,res)=>{

    const {courseId}=req.params;

    try{

        const course= await Course.findByIdAndDelete({
            _id:courseId,
        })

        if(!course){
            return res.status(404).json({error:"Course not found"})
        }
        res.status(200).json({message:"Course deleted successfully"});

    } catch(err){
        console.log("Error in course deleting", error)
    }
}

export const getCourses=async(req,res) =>{
    try{

        const courses=await Course.find({})
        res.status(200).json({ courses})

} catch (error){
        res.status(500).json({error:"Error in getting courses"});
        console.log("Error in get courses", error)
    }
}

export const courseDetails=async (req, res)=>{

    const {courseId}=req.params;

    try{
        const course=await Course.findById(courseId)
        if(!course){
            return res.status(404).json({error:"Course not found"});
        }
        res.status(200).json({course})

    } catch (error){
        res.status(500).json({error:"Error in getting course details"});
        console.log("Error in getting course details", error)
    }

}


export const buyCourses = async (req, res) => {
  const userId = req.userId;
  const { courseId } = req.params;

  try {
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    const existingPurchase = await Purchase.findOne({ userId, courseId });
    if (existingPurchase) {
      return res.status(400).json({ error: "Course already purchased" });
    }

    const newPurchase = new Purchase({ userId, courseId });
    await newPurchase.save();

    res.status(201).json({
      message: "Course purchased successfully",
      newPurchase,
    });
  } catch (error) {
    console.log("error in course buying", error);
    res.status(500).json({ error: "Error in buying course" });
  }
};
