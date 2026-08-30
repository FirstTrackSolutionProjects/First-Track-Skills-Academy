import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string({
      message: "Email is required",
    })
    .trim()
    .toLowerCase()
    .email({ message: "Please enter a valid email address" }),

  password: z
    .string({
      message: "Password is required",
    })
    .min(1, { message: "Password cannot be empty" }),
});

export const refreshTokenSchema = z.object({
  refresh_token: z
    .string({
      message: "Refresh token is required",
    })
    .min(1, { message: "Refresh token cannot be empty" }),
});
