import { z } from "zod";
import { rawPaginationShape, validateIdSchema } from "./genericSchema";
import { baseUserSchema, UserRoleEnum } from "./userSchema";

export const collegeProfileStatusEnum = z.enum(["PENDING", "APPROVED", "REJECTED"], {
  message: "Status must be one of: 'PENDING', 'APPROVED', 'REJECTED'",
});

export const createCollegeProfileSchema = z.object({
  college_name: z
    .string({
      message: "College name is required",
    })
    .trim()
    .min(2, { message: "College name must be at least 2 characters" })
    .max(255, { message: "College name cannot exceed 255 characters" }),

  college_code: z
    .string({ message: "College code must be a string" })
    .trim()
    .max(50, { message: "College code cannot exceed 50 characters" })
    .optional(),

  website: z
    .string({ message: "Website must be a string" })
    .trim()
    .url({ message: "Please enter a valid website URL" })
    .max(255, { message: "Website link cannot exceed 255 characters" })
    .optional()
    .or(z.literal("")),

  address: z
    .string({
      message: "Address is required",
    })
    .trim()
    .min(5, { message: "Address must be at least 5 characters" }),

  city: z
    .string({
      message: "City is required",
    })
    .trim()
    .min(2, { message: "City must be at least 2 characters" })
    .max(100, { message: "City name cannot exceed 100 characters" }),

  state: z
    .string({
      message: "State is required",
    })
    .trim()
    .min(2, { message: "State must be at least 2 characters" })
    .max(100, { message: "State name cannot exceed 100 characters" }),

  designation: z
    .string({
      message: "Contact person designation is required",
    })
    .trim()
    .min(2, { message: "Designation must be at least 2 characters" })
    .max(100, { message: "Designation cannot exceed 100 characters" }),

  contact_number: z
    .string({
      message: "Contact number is required",
    })
    .trim()
    .regex(/^\+?[0-9]{7,20}$/, {
      message: "Contact number must be between 7 and 20 digits (optional leading + allowed)",
    }),
});

export const collegeOnboardingSchema = baseUserSchema
  .merge(createCollegeProfileSchema)
  .extend({
    role: UserRoleEnum.default("COLLEGE"),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });

export const updateCollegeProfileStatusSchema = z.object({
  status: collegeProfileStatusEnum,
});

export const collegeProfileIdParamSchema = z.object({
  college_id: validateIdSchema,
});

export const getCollegeProfileQuerySchema = z
  .object({
    ...rawPaginationShape,
    status: collegeProfileStatusEnum.optional(),
    city: z.string().trim().optional(),
    state: z.string().trim().optional(),
    sort_by: z
      .enum([
        "id",
        "college_name",
        "college_code",
        "partner_code",
        "city",
        "state",
        "status",
        "created_at",
        "updated_at",
      ])
      .default("created_at"),
  })
  .transform((data) => {
    const effectivePage = data.page ?? 1;
    const effectiveOffset = data.offset ?? (effectivePage - 1) * data.limit;

    return {
      ...data,
      page: effectivePage,
      offset: effectiveOffset,
    };
  });

export const verifyPartnerCodeSchema = z.object({
  partner_code: z
    .string({ message: "Partner code is required" })
    .trim()
    .min(3, { message: "Partner code must be at least 3 characters long" })
    .max(64, { message: "Partner code must not exceed 64 characters" }),
});
