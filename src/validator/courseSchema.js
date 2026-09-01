import { z } from "zod";
import { validateIdSchema } from "./genericSchema";

export const courseCategoryEnum = z.enum(["FRONTEND", "BACKEND", "DATABASE", "FULLSTACK", "DEVOPS", "AI_ML"], {
  message: "Course category is invalid",
});

export const batchTimingEnum = z.enum(["MORNING", "AFTERNOON", "EVENING", "NIGHT"], {
  message: "Batch timing is invalid",
});

export const createCourseSchema = z.object({
  title: z.string({ message: "Title is required" }).trim().min(2).max(150),
  slug: z.string().trim().max(150).optional(),
  category: courseCategoryEnum,
  description: z.string().trim().max(2000).optional(),
  duration_weeks: z.coerce.number().int().positive(),
  thumbnail_url: z.string().trim().max(500).optional(),
});

export const createBatchSchema = z.object({
  course_id: validateIdSchema,
  mentor_id: validateIdSchema,
  batch_name: z.string({ message: "Batch name is required" }).trim().min(2).max(150),
  batch_timing: batchTimingEnum,
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  status: z.enum(["ACTIVE", "COMPLETED", "CANCELLED"]).default("ACTIVE"),
});
