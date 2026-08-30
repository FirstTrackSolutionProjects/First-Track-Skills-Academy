import { z } from "zod";

export const validateIdSchema = z.coerce
  .number({
    message: "ID must be a numeric value",
  })
  .int({ message: "ID must be an integer" })
  .positive({ message: "ID must be a positive integer greater than 0" });

export const rawPaginationShape = {
  page: z.coerce
    .number({ message: "Page must be a number" })
    .int({ message: "Page must be an integer" })
    .positive({ message: "Page must be greater than 0" })
    .optional(),

  limit: z.coerce
    .number({ message: "Limit must be a number" })
    .int({ message: "Limit must be an integer" })
    .positive({ message: "Limit must be greater than 0" })
    .max(100, { message: "Limit cannot exceed 100 records per page" })
    .default(10),

  offset: z.coerce
    .number({ message: "Offset must be a number" })
    .int({ message: "Offset must be an integer" })
    .nonnegative({ message: "Offset cannot be negative" })
    .optional(),

  sort_direction: z
    .enum(["asc", "desc"], {
      message: "Sort direction must be either 'asc' or 'desc'",
    })
    .default("asc"),

  search: z.string().trim().optional(),
};

export const paginationQuerySchema = z.object(rawPaginationShape).transform((data) => {
  const effectivePage = data.page ?? 1;
  const effectiveOffset = data.offset ?? (effectivePage - 1) * data.limit;

  return {
    ...data,
    page: effectivePage,
    offset: effectiveOffset,
  };
});
