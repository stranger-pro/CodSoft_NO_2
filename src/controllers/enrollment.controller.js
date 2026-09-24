import {
  createEnrollment,
  getEnrollments,
  getEnrollmentById,
  updateEnrollment,
  deleteEnrollment,
} from "../services/enrollment.service.js";


export const createEnrollmentController = async (
  req,
  res,
  next
) => {
  try {
    const {
      studentId,
      courseId,
      enrolledAt,
      status,
    } = req.body;

    const allowedFields = [
      "studentId",
      "courseId",
      "enrolledAt",
      "status",
    ];

    const unknownFields = Object.keys(req.body).filter(
      (field) => !allowedFields.includes(field)
    );

    if (unknownFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Unknown field(s): ${unknownFields.join(", ")}`,
      });
    }

    if (
      studentId === undefined ||
      courseId === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "studentId and courseId are required",
      });
    }
    if (
      !Number.isInteger(studentId) ||
      studentId <= 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "studentId must be a positive integer",
      });
    }


    if (
      !Number.isInteger(courseId) ||
      courseId <= 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "courseId must be a positive integer",
      });
    }


    if (enrolledAt !== undefined) {
      if (
        typeof enrolledAt !== "string" ||
        isNaN(Date.parse(enrolledAt))
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid enrolledAt date",
        });
      }
    }

    const allowedStatuses = [
      "active",
      "completed",
      "dropped",
    ];

    if (
      status !== undefined &&
      !allowedStatuses.includes(status)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "status must be active, completed or dropped",
      });
    }

    const enrollment = await createEnrollment({
      studentId,
      courseId,
      enrolledAt:
        enrolledAt !== undefined
          ? new Date(enrolledAt)
          : new Date(),
      status: status || "active",
    });


    res.status(201).json({
      success: true,
      message:
        "Student enrolled successfully",
      data: enrollment,
    });

  } catch (error) {
    next(error);
  }
};



export const getEnrollmentsController = async (
  req,
  res,
  next
) => {
  try {
    const {
      page = "1",
      limit = "10",
      sortBy = "createdAt",
      order = "desc",
    } = req.query;

    const pageNumber = Number(page);

    if (
      !Number.isInteger(pageNumber) ||
      pageNumber < 1
    ) {
      return res.status(400).json({
        success: false,
        message:
          "page must be a positive integer",
      });
    }

    const limitNumber = Number(limit);

    if (
      !Number.isInteger(limitNumber) ||
      limitNumber < 1 ||
      limitNumber > 100
    ) {
      return res.status(400).json({
        success: false,
        message:
          "limit must be between 1 and 100",
      });
    }
    
    const allowedSortFields = [
      "id",
      "studentId",
      "courseId",
      "enrolledAt",
      "status",
      "createdAt",
    ];

    if (!allowedSortFields.includes(sortBy)) {
      return res.status(400).json({
        success: false,
        message:
          `sortBy must be one of: ${allowedSortFields.join(", ")}`,
      });
    }

    if (
      order !== "asc" &&
      order !== "desc"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "order must be either asc or desc",
      });
    }
    
    const enrollments = await getEnrollments({
      page: pageNumber,
      limit: limitNumber,
      sortBy,
      order,
    });


    res.status(200).json({
      success: true,
      data: enrollments,
    });

  } catch (error) {
    next(error);
  }
};


export const getEnrollmentController = async (
  req,
  res,
  next
) => {
  try {
    const id = Number(req.params.id);


    if (
      !Number.isInteger(id) ||
      id <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid enrollment ID",
      });
    }


    const enrollment =
      await getEnrollmentById(id);


    res.status(200).json({
      success: true,
      data: enrollment,
    });

  } catch (error) {
    next(error);
  }
};



export const updateEnrollmentController = async (
  req,
  res,
  next
) => {
  try {
    const id = Number(req.params.id);

    if (
      !Number.isInteger(id) ||
      id <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid enrollment ID",
      });
    }


    const {
      studentId,
      courseId,
      enrolledAt,
      status,
    } = req.body;
    
    const allowedFields = [
      "studentId",
      "courseId",
      "enrolledAt",
      "status",
    ];

    const unknownFields = Object.keys(req.body).filter(
      (field) => !allowedFields.includes(field)
    );

    if (unknownFields.length > 0) {
      return res.status(400).json({
        success: false,
        message:
          `Unknown field(s): ${unknownFields.join(", ")}`,
      });
    }

    if (
      studentId === undefined &&
      courseId === undefined &&
      enrolledAt === undefined &&
      status === undefined
    ) {
      return res.status(400).json({
        success: false,
        message:
          "At least one field is required for update",
      });
    }
    
    if (
      studentId !== undefined &&
      (!Number.isInteger(studentId) ||
        studentId <= 0)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "studentId must be a positive integer",
      });
    }


    if (
      courseId !== undefined &&
      (!Number.isInteger(courseId) ||
        courseId <= 0)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "courseId must be a positive integer",
      });
    }


    if (
      enrolledAt !== undefined &&
      (
        typeof enrolledAt !== "string" ||
        isNaN(Date.parse(enrolledAt))
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid enrolledAt date",
      });
    }


    const allowedStatuses = [
      "active",
      "completed",
      "dropped",
    ];

    if (
      status !== undefined &&
      !allowedStatuses.includes(status)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "status must be active, completed or dropped",
      });
    }
    
    const updateData = {};

    if (studentId !== undefined) {
      updateData.studentId = studentId;
    }

    if (courseId !== undefined) {
      updateData.courseId = courseId;
    }

    if (enrolledAt !== undefined) {
      updateData.enrolledAt =
        new Date(enrolledAt);
    }

    if (status !== undefined) {
      updateData.status = status;
    }


    const enrollment =
      await updateEnrollment(
        id,
        updateData
      );


    res.status(200).json({
      success: true,
      message:
        "Enrollment updated successfully",
      data: enrollment,
    });

  } catch (error) {
    next(error);
  }
};



export const deleteEnrollmentController = async (
  req,
  res,
  next
) => {
  try {
    const id = Number(req.params.id);


    if (
      !Number.isInteger(id) ||
      id <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid enrollment ID",
      });
    }


    const enrollment =
      await deleteEnrollment(id);


    res.status(200).json({
      success: true,
      message:
        "Enrollment deleted successfully",
      data: enrollment,
    });

  } catch (error) {
    next(error);
  }
};