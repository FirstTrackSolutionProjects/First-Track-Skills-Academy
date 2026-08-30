import { z } from "zod";
import { validateIdSchema } from "./genericSchema";

export const batchTimingEnum = z.enum(["MORNING", "AFTERNOON", "EVENING", "NIGHT"], {
  message: "Batch timing must be 'MORNING', 'AFTERNOON', 'EVENING', or 'NIGHT'",
});

export const enrollCohortCourseSchema = z.object({
  course_id: validateIdSchema,
  partner_code: z.string().trim().min(3, { message: "Partner code is required" }),
  batch_timing: batchTimingEnum,
});

