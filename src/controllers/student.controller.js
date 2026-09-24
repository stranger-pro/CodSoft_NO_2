import {
  createStudent,
  getStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
} from "../services/student.service.js";




export const createStudentController = async (req, res, next) => {
  try {
    const { name, email, phone, dateOfBirth } = req.body;

    
    if (!name || !email || !phone) {
      return res.status(400).json({
        success: false,
        message: "name, email and phone are required",
      });
    }

    
    if (typeof name !== "string" || name.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: "Name must be at least 2 characters",
      });
    }

   
    if (
      typeof email !== "string" ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid email",
      });
    }

   
    if (
      typeof phone !== "string" ||
      !/^[0-9]{10}$/.test(phone)
    ) {
      return res.status(400).json({
        success: false,
        message: "Phone must contain exactly 10 digits",
      });
    }

    

    const student = await createStudent({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone,
      dateOfBirth,
    });

    res.status(201).json({
      success: true,
      message: "Student created successfully",
      data: student,
    });
  } catch (error) {
    next(error);
  }
};



export const getStudentsController = async (req, res, next) => {
  try {
    const {
      search,
      page = "1",
      limit = "10",
      sortBy = "createdAt",
      order = "desc",
    } = req.query;

    const pageNumber = Number(page);
    const limitNumber = Number(limit);

  
    if (!Number.isInteger(pageNumber) || pageNumber < 1) {
      return res.status(400).json({
        success: false,
        message: "page must be a positive integer",
      });
    }

  
    if (
      !Number.isInteger(limitNumber) ||
      limitNumber < 1 ||
      limitNumber > 100
    ) {
      return res.status(400).json({
        success: false,
        message: "limit must be between 1 and 100",
      });
    }

    const allowedSortFields = [
      "name",
      "email",
      "createdAt",
    ];

    if (!allowedSortFields.includes(sortBy)) {
      return res.status(400).json({
        success: false,
        message: `sortBy must be one of: ${allowedSortFields.join(", ")}`,
      });
    }

 
    if (!["asc", "desc"].includes(order)) {
      return res.status(400).json({
        success: false,
        message: "order must be asc or desc",
      });
    }

    const students = await getStudents({
      search,
      page: pageNumber,
      limit: limitNumber,
      sortBy,
      order,
    });

    res.status(200).json({
      success: true,
      data: students,
    });
  } catch (error) {
    next(error);
  }
};


export const getStudentController = async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid student ID",
      });
    }

    const student = await getStudentById(id);

    res.status(200).json({
      success: true,
      data: student,
    });
  } catch (error) {
    next(error);
  }
};



export const updateStudentController = async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid student ID",
      });
    }

    const {
      name,
      email,
      phone,
      dateOfBirth,
    } = req.body;

    
    if (
      name === undefined &&
      email === undefined &&
      phone === undefined &&
      dateOfBirth === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "At least one field is required for update",
      });
    }

   
    if (
      name !== undefined &&
      (typeof name !== "string" ||
        name.trim().length < 2)
    ) {
      return res.status(400).json({
        success: false,
        message: "Name must be at least 2 characters",
      });
    }

    if (
      email !== undefined &&
      (typeof email !== "string" ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid email",
      });
    }

   
    if (
      phone !== undefined &&
      (typeof phone !== "string" ||
        !/^[0-9]{10}$/.test(phone))
    ) {
      return res.status(400).json({
        success: false,
        message: "Phone must contain exactly 10 digits",
      });
    }

    
    if (
      dateOfBirth !== undefined &&
      (typeof dateOfBirth !== "string" ||
        isNaN(Date.parse(dateOfBirth)))
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid dateOfBirth",
      });
    }

   
    const updateData = {};

    if (name !== undefined) {
      updateData.name = name.trim();
    }

    if (email !== undefined) {
      updateData.email = email.trim().toLowerCase();
    }

    if (phone !== undefined) {
      updateData.phone = phone;
    }

    if (dateOfBirth !== undefined) {
      updateData.dateOfBirth = dateOfBirth;
    }

    const student = await updateStudent(id, updateData);

    res.status(200).json({
      success: true,
      message: "Student updated successfully",
      data: student,
    });
  } catch (error) {
    next(error);
  }
};



export const deleteStudentController = async (req, res, next) => {
  try {
    const id = Number(req.params.id);


    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid student ID",
      });
    }

    const student = await deleteStudent(id);

    res.status(200).json({
      success: true,
      message: "Student deleted successfully",
      data: student,
    });
  } catch (error) {
    next(error);
  }
};