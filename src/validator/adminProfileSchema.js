import { z } from "zod";
import { validateIdSchema } from "./genericSchema";
import { baseUserSchema, UserRoleEnum } from "./userSchema";

export const adminProfileSchema = z.object({
  department: z
    .string({
      message: "Department is required",
    })
    .trim()
    .min(1, { message: "Department must be at least 1 character" })
    .max(100, { message: "Department name cannot exceed 100 characters" }),

  phone_number: z
    .string({
      message: "Phone number is required",
    })
    .trim()
    .regex(/^\+?[0-9]{7,20}$/, {
      message: "Phone number must be between 7 and 20 digits (optional leading + allowed)",
    }),
});

export const adminOnboardingSchema = baseUserSchema
  .merge(adminProfileSchema)
  .extend({
    role: UserRoleEnum.default("ADMIN"),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });

export const adminProfileIdParamSchema = z.object({
  admin_id: validateIdSchema,
});
