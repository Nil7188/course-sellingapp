import { Course } from "../models/course.model.js";
import Purchase from "../models/purchase.model.js";
import { v2 as cloudinary } from "cloudinary";

/* =========================
   CREATE COURSE
========================= */
export const createCourse = async (req, res) => {
  try {
    const adminId = req.adminId;
    const { title, description, price } = req.body;

    if (!title || !description || !price) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (!req.files || !req.files.image) {
      return res.status(400).json({ error: "Image is required" });
    }

    const image = req.files.image;

    const allowedFormats = ["image/jpg", "image/jpeg", "image/png"];
    if (!allowedFormats.includes(image.mimetype)) {
      return res.status(400).json({
        error: "Invalid file format. Only JPG, JPEG, PNG allowed",
      });
    }

    // Upload to Cloudinary
    const cloudResponse = await cloudinary.uploader.upload(
      image.tempFilePath,
      { folder: "courses" }
    );

    const savedCourse = await Course.create({
      title,
      description,
      price,
      image: {
        public_id: cloudResponse.public_id,
        url: cloudResponse.secure_url,
      },
      creatorId: adminId,
    });

    return res.status(201).json({
      message: "Course created successfully",
      course: savedCourse,
    });
  } catch (error) {
    console.log("Create course error:", error);
    return res.status(500).json({ error: "Error creating course" });
  }
};

/* =========================
   UPDATE COURSE
========================= */
export const updateCourse = async (req, res) => {
  try {
    const adminId = req.adminId;
    const { courseId } = req.params;
    const { title, description, price } = req.body;

    const course = await Course.findOne({
      _id: courseId,
      creatorId: adminId,
    });

    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    // Update text fields
    if (title) course.title = title;
    if (description) course.description = description;
    if (price) course.price = price;

    // If new image uploaded
    if (req.files && req.files.image) {
      const image = req.files.image;

      const allowedFormats = ["image/jpg", "image/jpeg", "image/png"];
      if (!allowedFormats.includes(image.mimetype)) {
        return res.status(400).json({
          error: "Invalid file format",
        });
      }

      // Delete old image from Cloudinary
      if (course.image?.public_id) {
        await cloudinary.uploader.destroy(course.image.public_id);
      }

      // Upload new image
      const cloudResponse = await cloudinary.uploader.upload(
        image.tempFilePath,
        { folder: "courses" }
      );

      course.image = {
        public_id: cloudResponse.public_id,
        url: cloudResponse.secure_url,
      };
    }

    await course.save();

    return res.status(200).json({
      message: "Course updated successfully",
      course,
    });
  } catch (error) {
    console.log("Update course error:", error);
    return res.status(500).json({ error: "Error updating course" });
  }
};

/* =========================
   DELETE COURSE
========================= */
export const deleteCourse = async (req, res) => {
  try {
    const adminId = req.adminId;
    const { courseId } = req.params;

    const course = await Course.findOneAndDelete({
      _id: courseId,
      creatorId: adminId,
    });

    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    // Delete image from Cloudinary
    if (course.image?.public_id) {
      await cloudinary.uploader.destroy(course.image.public_id);
    }

    return res.status(200).json({
      message: "Course deleted successfully",
    });
  } catch (error) {
    console.log("Delete course error:", error);
    return res.status(500).json({ error: "Error deleting course" });
  }
};

/* =========================
   GET ALL COURSES
========================= */
export const getCourses = async (req, res) => {
  try {
    const courses = await Course.find({});
    return res.status(200).json({ courses });
  } catch (error) {
    console.log("Get courses error:", error);
    return res.status(500).json({ error: "Error fetching courses" });
  }
};

/* =========================
   COURSE DETAILS
========================= */
export const courseDetails = async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    return res.status(200).json({ course });
  } catch (error) {
    console.log("Course details error:", error);
    return res.status(500).json({ error: "Error fetching course details" });
  }
};

/* =========================
   BUY COURSE
========================= */
export const buyCourse = async (req, res) => {
  try {
    const userId = req.userId;
    const { courseId } = req.params;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    const existingPurchase = await Purchase.findOne({
      userId,
      courseId,
    });

    if (existingPurchase) {
      return res.status(400).json({
        error: "Course already purchased",
      });
    }

    const newPurchase = await Purchase.create({
      userId,
      courseId,
    });

    return res.status(201).json({
      message: "Course purchased successfully",
      purchase: newPurchase,
    });
  } catch (error) {
    console.log("Buy course error:", error);
    return res.status(500).json({ error: "Error buying course" });
  }
};
