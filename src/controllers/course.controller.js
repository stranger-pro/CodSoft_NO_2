import {
  createCourse,
  getCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
} from "../services/course.service.js";



export const createCourseController = async (
  req,
  res,
  next
) => {
  try {
    const {
      name,
      code,
      description,
      credits,
    } = req.body;
    
    const allowedFields = [
      "name",
      "code",
      "description",
      "credits",
    ];

    const receivedFields = Object.keys(req.body);

    const unknownFields = receivedFields.filter(
      (field) => !allowedFields.includes(field)
    );

    if (unknownFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Unknown field(s): ${unknownFields.join(", ")}`,
      });
    }

    if (
      name === undefined ||
      code === undefined ||
      credits === undefined
    ) {
      return res.status(400).json({
        success: false,
        message:
          "name, code and credits are required",
      });
    }

    if (
      typeof name !== "string" ||
      name.trim().length < 2 ||
      name.trim().length > 150
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Name must be a string between 2 and 150 characters",
      });
    }


    if (
      typeof code !== "string" ||
      code.trim().length < 2 ||
      code.trim().length > 20
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Course code must be between 2 and 20 characters",
      });
    }

    if (
      typeof credits !== "number" ||
      !Number.isInteger(credits) ||
      credits <= 0 ||
      credits > 20
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Credits must be a positive integer between 1 and 20",
      });
    }

    if (description !== undefined) {
      if (
        typeof description !== "string" ||
        description.length > 1000
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Description must be a string with maximum 1000 characters",
        });
      }
    }


     const course = await createCourse({
      name: name.trim(),
      code: code.trim().toUpperCase(),
      description:
        description?.trim() || null,
      credits,
    });


    res.status(201).json({
      success: true,
      message: "Course created successfully",
      data: course,
    });

  } catch (error) {
    next(error);
  }
};



export const getCoursesController = async (
  req,
  res,
  next
) => {
  try {
    const {
      search,
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


     if (
      search !== undefined &&
      typeof search !== "string"
    ) {
      return res.status(400).json({
        success: false,
        message: "search must be a string",
      });
    }
    
    const allowedSortFields = [
      "name",
      "code",
      "credits",
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

    const courses = await getCourses({
      search,
      page: pageNumber,
      limit: limitNumber,
      sortBy,
      order,
    });


    res.status(200).json({
      success: true,
      data: courses,
    });

  } catch (error) {
    next(error);
  }
};



export const getCourseController = async (
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
        message: "Invalid course ID",
      });
    }


    const course = await getCourseById(id);


    res.status(200).json({
      success: true,
      data: course,
    });

  } catch (error) {
    next(error);
  }
};


export const updateCourseController = async (
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
        message: "Invalid course ID",
      });
    }


    const {
      name,
      code,
      description,
      credits,
    } = req.body;


    // --------------------------------
    // CHECK UNKNOWN FIELDS
    // --------------------------------

    const allowedFields = [
      "name",
      "code",
      "description",
      "credits",
    ];

    const receivedFields = Object.keys(req.body);

    const unknownFields = receivedFields.filter(
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
      name === undefined &&
      code === undefined &&
      description === undefined &&
      credits === undefined
    ) {
      return res.status(400).json({
        success: false,
        message:
          "At least one field is required for update",
      });
    }


    if (name !== undefined) {
      if (
        typeof name !== "string" ||
        name.trim().length < 2 ||
        name.trim().length > 150
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Name must be between 2 and 150 characters",
        });
      }
    }


    if (code !== undefined) {
      if (
        typeof code !== "string" ||
        code.trim().length < 2 ||
        code.trim().length > 20
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Course code must be between 2 and 20 characters",
        });
      }
    }


    if (description !== undefined) {
      if (
        typeof description !== "string" ||
        description.length > 1000
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Description must be maximum 1000 characters",
        });
      }
    }

    if (credits !== undefined) {
      if (
        typeof credits !== "number" ||
        !Number.isInteger(credits) ||
        credits <= 0 ||
        credits > 20
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Credits must be a positive integer between 1 and 20",
        });
      }
    }


  
    const updateData = {};

    if (name !== undefined) {
      updateData.name = name.trim();
    }

    if (code !== undefined) {
      updateData.code =
        code.trim().toUpperCase();
    }

    if (description !== undefined) {
      updateData.description =
        description.trim();
    }

    if (credits !== undefined) {
      updateData.credits = credits;
    }


    const course = await updateCourse(
      id,
      updateData
    );


    res.status(200).json({
      success: true,
      message: "Course updated successfully",
      data: course,
    });

  } catch (error) {
    next(error);
  }
};


export const deleteCourseController = async (
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
        message: "Invalid course ID",
      });
    }


    const course = await deleteCourse(id);


    res.status(200).json({
      success: true,
      message: "Course deleted successfully",
      data: course,
    });

  } catch (error) {
    next(error);
  }
};