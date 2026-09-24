import {
  pgTable,
  serial,
  varchar,
  text,
  integer,
  timestamp,
  date,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const students = pgTable(
  "students",
  {
    id: serial("id").primaryKey(),

    name: varchar("name", {
      length: 100,
    }).notNull(),

    email: varchar("email", {
      length: 255,
    }).notNull(),

    phone: varchar("phone", {
      length: 20,
    }),

    dateOfBirth: date("date_of_birth"),

    createdAt: timestamp("created_at")
      .defaultNow()
      .notNull(),

    updatedAt: timestamp("updated_at")
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    emailUnique: uniqueIndex("students_email_unique")
      .on(table.email),
  })
);

export const courses = pgTable(
  "courses",
  {
    id: serial("id").primaryKey(),

    name: varchar("name", {
      length: 150,
    }).notNull(),

    code: varchar("code", {
      length: 20,
    }).notNull(),

    description: text("description"),

    credits: integer("credits").notNull(),

    createdAt: timestamp("created_at")
      .defaultNow()
      .notNull(),

    updatedAt: timestamp("updated_at")
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    codeUnique: uniqueIndex("courses_code_unique")
      .on(table.code),
  })
);

export const enrollments = pgTable(
  "enrollments",
  {
    id: serial("id").primaryKey(),

    studentId: integer("student_id")
      .notNull()
      .references(() => students.id, {
        onDelete: "cascade",
      }),

    courseId: integer("course_id")
      .notNull()
      .references(() => courses.id, {
        onDelete: "cascade",
      }),

    enrolledAt: timestamp("enrolled_at")
      .defaultNow()
      .notNull(),

    status: varchar("status", {
      length: 20,
    }).default("active").notNull(),

    createdAt: timestamp("created_at")
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    studentCourseUnique: uniqueIndex(
      "student_course_unique"
    ).on(table.studentId, table.courseId),
  })
);