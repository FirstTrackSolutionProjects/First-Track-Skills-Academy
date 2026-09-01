import { z } from "zod";
import { baseUserSchema, UserRoleEnum } from "./userSchema";

export const mentorOnboardingSchema = baseUserSchema
  .extend({
    subjects: z.array(z.string().trim().min(1)).min(1, "Please add at least one subject"),
    years_of_experience: z.coerce.number().int().min(0).max(60),
    bio: z.string().trim().max(1000).optional(),
    role: UserRoleEnum.default("MENTOR"),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });
