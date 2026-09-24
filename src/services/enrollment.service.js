import {
  eq,
  and,
  asc,
  desc,
} from "drizzle-orm";

import { db } from "../db/index.js";
import { enrollments,students,courses } from "../db/schema.js";

export const createEnrollment = async (data) => {
  const [student] = await db
    .select()
    .from(students)
    .where(eq(students.id, data.studentId));

  if (!student) {
    const error = new Error("Student not found");
    error.statusCode = 404;
    throw error;
  }

  const [course] = await db
    .select()
    .from(courses)
    .where(eq(courses.id, data.courseId));

  if (!course) {
    const error = new Error("Course not found");
    error.statusCode = 404;
    throw error;
  }

  const existingEnrollment = await db
    .select()
    .from(enrollments)
    .where(
      and(
        eq(enrollments.studentId, data.studentId),
        eq(enrollments.courseId, data.courseId)
      )
    );

  if (existingEnrollment.length > 0) {
    const error = new Error(
      "Student is already enrolled in this course"
    );

    error.statusCode = 409;
    throw error;
  }

  const [enrollment] = await db
    .insert(enrollments)
    .values(data)
    .returning();

  return enrollment;
};



export const getEnrollments = async ({
  page = 1,
  limit = 10,
  sortBy = "createdAt",
  order = "desc",
}) => {
  const offset = (page - 1) * limit;

  const allowedSortFields = {
    id: enrollments.id,
    studentId: enrollments.studentId,
    courseId: enrollments.courseId,
    enrolledAt: enrollments.enrolledAt,
    status: enrollments.status,
    createdAt: enrollments.createdAt,
  };

  const sortColumn =
    allowedSortFields[sortBy] ||
    enrollments.createdAt;

  const sortOrder =
    order === "asc"
      ? asc(sortColumn)
      : desc(sortColumn);

  return await db
    .select()
    .from(enrollments)
    .orderBy(sortOrder)
    .limit(limit)
    .offset(offset);
};



export const getEnrollmentById = async (id) => {
  const [enrollment] = await db
    .select()
    .from(enrollments)
    .where(eq(enrollments.id, id));

  if (!enrollment) {
    const error = new Error("Enrollment not found");
    error.statusCode = 404;
    throw error;
  }

  return enrollment;
};



export const updateEnrollment = async (id, data) => {
  const existingEnrollment =
    await getEnrollmentById(id);

  
  if (
    data.studentId !== undefined &&
    data.studentId !== existingEnrollment.studentId
  ) {
    const [student] = await db
      .select()
      .from(students)
      .where(eq(students.id, data.studentId));

    if (!student) {
      const error = new Error("Student not found");
      error.statusCode = 404;
      throw error;
    }
  }

  
  if (
    data.courseId !== undefined &&
    data.courseId !== existingEnrollment.courseId
  ) {
    const [course] = await db
      .select()
      .from(courses)
      .where(eq(courses.id, data.courseId));

    if (!course) {
      const error = new Error("Course not found");
      error.statusCode = 404;
      throw error;
    }
  }


  const studentId =
    data.studentId ?? existingEnrollment.studentId;

  const courseId =
    data.courseId ?? existingEnrollment.courseId;

  const duplicate = await db
    .select()
    .from(enrollments)
    .where(
      and(
        eq(enrollments.studentId, studentId),
        eq(enrollments.courseId, courseId)
      )
    );

  if (
    duplicate.length > 0 &&
    duplicate[0].id !== id
  ) {
    const error = new Error(
      "Student is already enrolled in this course"
    );

    error.statusCode = 409;
    throw error;
  }

  const [updatedEnrollment] = await db
    .update(enrollments)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(enrollments.id, id))
    .returning();

  return updatedEnrollment;
};


export const deleteEnrollment = async (id) => {
  await getEnrollmentById(id);

  const [deletedEnrollment] = await db
    .delete(enrollments)
    .where(eq(enrollments.id, id))
    .returning();

  return deletedEnrollment;
};