import { eq, ilike, or, asc, desc, and } from "drizzle-orm";
import { db } from "../db/index.js";
import { students , enrollments} from "../db/schema.js";


export const createStudent = async (data) => {
  const existingStudent = await db
    .select()
    .from(students)
    .where(eq(students.email, data.email));

  if (existingStudent.length > 0) {
    const error = new Error("Student with this email already exists");
    error.statusCode = 409;
    throw error;
  }

  const [student] = await db
    .insert(students)
    .values(data)
    .returning();


  return student;
};

export const getStudents = async ({
  search,
  page = 1,
  limit = 10,
  sortBy = "createdAt",
  order = "desc",
}) => {
  const offset = (page - 1) * limit;

  const conditions = [];


  if (search) {
    conditions.push(
      or(
        ilike(students.name, `%${search}%`),
        ilike(students.email, `%${search}%`),
        ilike(students.phone, `%${search}%`)
      )
    );
  }


  const allowedSortFields = {
    name: students.name,
    email: students.email,
    createdAt: students.createdAt,
  };

  const sortColumn =
    allowedSortFields[sortBy] || students.createdAt;

  const sortOrder =
    order === "asc"
      ? asc(sortColumn)
      : desc(sortColumn);

  const query = db
    .select()
    .from(students)
    .limit(limit)
    .offset(offset)
    .orderBy(sortOrder);

  if (conditions.length > 0) {
    query.where(and(...conditions));
  }

  return await query;
};


export const getStudentById = async (id) => {
  const [student] = await db
    .select()
    .from(students)
    .where(eq(students.id, id));

  if (!student) {
    const error = new Error("Student not found");
    error.statusCode = 404;
    throw error;
  }

  return student;
};


export const updateStudent = async (id, data) => {
  const existingStudent = await getStudentById(id);

  if (
    data.email &&
    data.email !== existingStudent.email
  ) {
    const emailExists = await db
      .select()
      .from(students)
      .where(eq(students.email, data.email));

    if (emailExists.length > 0) {
      const error = new Error(
        "Student with this email already exists"
      );

      error.statusCode = 409;
      throw error;
    }
  }

  const [updatedStudent] = await db
    .update(students)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(students.id, id))
    .returning();

  return updatedStudent;
};


export const deleteStudent = async (id) => {

  await getStudentById(id);

  
  const existingEnrollments = await db
    .select()
    .from(enrollments)
    .where(eq(enrollments.studentId, id));

  if (existingEnrollments.length > 0) {
    const error = new Error(
      "Cannot delete student because the student has enrollments"
    );

    error.statusCode = 409;
    throw error;
  }

  
  const [deletedStudent] = await db
    .delete(students)
    .where(eq(students.id, id))
    .returning();

  return deletedStudent;
};