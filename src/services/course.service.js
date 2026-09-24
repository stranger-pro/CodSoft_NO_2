import {
  eq,
  ilike,
  or,
  asc,
  desc,
} from "drizzle-orm";

import { db } from "../db/index.js";
import { courses,enrollments } from "../db/schema.js";



export const createCourse = async (data) => {

  const existingCourse = await db
    .select()
    .from(courses)
    .where(eq(courses.code, data.code));

  if (existingCourse.length > 0) {
    const error = new Error(
      "Course with this code already exists"
    );

    error.statusCode = 409;
    throw error;
  }

  const [course] = await db
    .insert(courses)
    .values(data)
    .returning();

  return course;
};



export const getCourses = async ({
  search,
  page = 1,
  limit = 10,
  sortBy = "createdAt",
  order = "desc",
}) => {
  const offset = (page - 1) * limit;

  const allowedSortFields = {
    name: courses.name,
    code: courses.code,
    credits: courses.credits,
    createdAt: courses.createdAt,
  };

  const sortColumn =
    allowedSortFields[sortBy] || courses.createdAt;

  const sortOrder =
    order === "asc"
      ? asc(sortColumn)
      : desc(sortColumn);

  let query = db
    .select()
    .from(courses);

  if (search) {
    query = query.where(
      or(
        ilike(courses.name, `%${search}%`),
        ilike(courses.code, `%${search}%`),
        ilike(courses.description, `%${search}%`)
      )
    );
  }

  query = query
    .orderBy(sortOrder)
    .limit(limit)
    .offset(offset);

  return await query;
};


export const getCourseById = async (id) => {
  const [course] = await db
    .select()
    .from(courses)
    .where(eq(courses.id, id));

  if (!course) {
    const error = new Error("Course not found");

    error.statusCode = 404;
    throw error;
  }

  return course;
};



export const updateCourse = async (id, data) => {
  const existingCourse = await getCourseById(id);


  if (
    data.code &&
    data.code !== existingCourse.code
  ) {
    const codeExists = await db
      .select()
      .from(courses)
      .where(eq(courses.code, data.code));

    if (codeExists.length > 0) {
      const error = new Error(
        "Course with this code already exists"
      );

      error.statusCode = 409;
      throw error;
    }
  }

  const [updatedCourse] = await db
    .update(courses)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(courses.id, id))
    .returning();

  return updatedCourse;
};



export const deleteCourse = async (id) => {
  await getCourseById(id);

  const existingEnrollments = await db
    .select()
    .from(enrollments)
    .where(eq(enrollments.courseId, id));

  if (existingEnrollments.length > 0) {
    const error = new Error(
      "Cannot delete course because students are enrolled in it"
    );

    error.statusCode = 409;
    throw error;
  }

  const [deletedCourse] = await db
    .delete(courses)
    .where(eq(courses.id, id))
    .returning();

  return deletedCourse;
};