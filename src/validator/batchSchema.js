import { z } from "zod";

export const assignPrimaryMentorSchema = z.object({
  mentor_id: z.coerce.number().int().positive({ message: "Please select a valid mentor" }),
});

export const assignSubstituteMentorSchema = z.object({
  substitute_mentor_id: z.coerce.number().int().positive({ message: "Please select a valid substitute mentor" }),
  start_date: z.string().optional().nullable(),
  end_date: z.string().optional().nullable(),
  reason: z.string().trim().max(1000).optional().nullable(),
});

export const allocateStudentsSchema = z.object({
  enrollment_ids: z.array(z.coerce.number().int().positive()).min(1, { message: "Select at least one student to allocate" }),
});

export const transferStudentSchema = z.object({
  enrollment_id: z.coerce.number().int().positive(),
  target_batch_id: z.coerce.number().int().positive({ message: "Please select a target batch" }),
});
