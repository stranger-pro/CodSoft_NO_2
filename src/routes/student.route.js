import express from "express";

import {
  createStudentController,
  getStudentsController,
  getStudentController,
  updateStudentController,
  deleteStudentController,
} from "../controllers/student.controller.js";

const router = express.Router();


router.post("/", createStudentController);


router.get("/", getStudentsController);


router.get("/:id", getStudentController);


router.patch("/:id", updateStudentController);


router.delete("/:id", deleteStudentController);

export default router;