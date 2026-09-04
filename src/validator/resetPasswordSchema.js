import { z } from "zod";

export const resetPasswordSchema = z
  .object({
    password: z
      .string({
        message: "Password is required",
      })
      .min(8, { message: "Password must be at least 8 characters" }),
    confirmPassword: z
      .string({
        message: "Please confirm your password",
      })
      .min(1, { message: "Please confirm your password" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });