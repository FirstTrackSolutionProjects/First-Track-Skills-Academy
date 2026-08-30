export const validateWithSchema = (schema, value) => {
  const result = schema.safeParse(value);

  if (!result.success) {
    throw new Error(result.error.issues[0]?.message || "Please check the highlighted fields");
  }

  return result.data;
};

export const mapZodIssuesToFieldErrors = (zodError) => {
  const fieldErrors = {};

  if (zodError && Array.isArray(zodError.issues)) {
    zodError.issues.forEach((issue) => {
      const field = issue.path[0];
      if (field && !fieldErrors[field]) {
        fieldErrors[field] = issue.message;
      }
    });
  }

  return fieldErrors;
};
