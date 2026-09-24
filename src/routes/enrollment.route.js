import express from "express";

import {
  createEnrollmentController,
  getEnrollmentsController,
  getEnrollmentController,
  updateEnrollmentController,
  deleteEnrollmentController,
} from "../controllers/enrollment.controller.js";

const router = express.Router();


router.post(
  "/",
  createEnrollmentController
);


router.get(
  "/",
  getEnrollmentsController
);


router.get(
  "/:id",
  getEnrollmentController
);


router.patch(
  "/:id",
  updateEnrollmentController
);


router.delete(
  "/:id",
  deleteEnrollmentController
);

export default router;