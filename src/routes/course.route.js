import express from "express";

import {
  createCourseController,
  getCoursesController,
  getCourseController,
  updateCourseController,
  deleteCourseController,
} from "../controllers/course.controller.js";

const router = express.Router();

router.post("/", createCourseController);


router.get("/", getCoursesController);


router.get("/:id", getCourseController);


router.patch("/:id", updateCourseController);


router.delete("/:id", deleteCourseController);


export default router;