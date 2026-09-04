import { z } from "zod";
import { paginationQuerySchema } from "./genericSchema";

export const UserRoleEnum = z.enum(
  ["STUDENT", "MENTOR", "COLLEGE", "ADMIN", "SUPERADMIN"],
  {
    message: "Role must be one of: STUDENT, MENTOR, COLLEGE, ADMIN, SUPERADMIN",
  }
);

export const baseUserSchema = z.object({
  first_name: z
    .string({ message: "First name is required" })
    .trim()
    .min(2, { message: "First name must be at least 2 characters" })
    .max(50, { message: "First name cannot exceed 50 characters" }),

  middle_name: z
    .string({ message: "Middle name must be a string" })
    .trim()
    .max(50, { message: "Middle name cannot exceed 50 characters" })
    .optional(),

  last_name: z
    .string({ message: "Last name must be a string" })
    .trim()
    .max(50, { message: "Last name cannot exceed 50 characters" })
    .optional(),

  email: z
    .string({
      message: "Email address is required",
    })
    .trim()
    .toLowerCase()
    .email({ message: "Please enter a valid email address" }),

  password: z
    .string({
      message: "Password is required",
    })
    .min(8, { message: "Password must be at least 8 characters long" })
    .max(100, { message: "Password cannot exceed 100 characters" })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
    .regex(/[0-9]/, { message: "Password must contain at least one numeric digit" })
    .regex(/[^a-zA-Z0-9]/, { message: "Password must contain at least one special character" }),

  confirm_password: z.string({
    message: "Confirm password is required",
  }),

  role: UserRoleEnum.default("STUDENT"),

  gender: z.string().trim().optional(),
  phone_number: z.string().trim().optional(),
  dob: z.string().trim().optional(),
  district: z.string().trim().optional(),
  state: z.string().trim().optional(),
  pin: z.string().trim().optional(),
  qualification: z.string().trim().optional(),
  college: z.string().trim().optional(),
  profile_image: z.string().trim().optional(),
  resume: z.string().trim().optional(),
  agree: z.boolean().optional(),
});

export const userRegistrationSchema = baseUserSchema.refine(
  (data) => data.password === data.confirm_password,
  {
    message: "Passwords do not match",
    path: ["confirm_password"],
  }
);

export const getUserQuerySchema = paginationQuerySchema.and(
  z.object({
    sort_by: z
      .enum(["id", "first_name", "last_name", "email", "role", "created_at"], {
        message: "Invalid sort field. Allowed: id, first_name, last_name, email, role, created_at",
      })
      .default("id"),

    filters: z.record(z.string(), z.unknown(), {
      message: "Filters must be an object of key-value pairs",
    })
      .optional()
      .default({}),
  })
);
