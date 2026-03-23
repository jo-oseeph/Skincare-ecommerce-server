

import { ZodError } from "zod";

/**
 * @param {import("zod").ZodSchema} schema  - Zod schema to validate against
 * @param {"body"|"query"} source           - Which part of the request to validate
 */
const validate = (schema, source = "body") => {
  return (req, res, next) => {
    const result = schema.safeParse(req[source]);

    if (!result.success) {
      // Flatten Zod's nested error structure into a simple
      // key → message array map for easy frontend consumption.
      const errors = result.error.flatten().fieldErrors;

      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

    // Replace the raw input with the parsed (and coerced) data.
    // This means controllers always receive clean, typed values.
    req[source] = result.data;
    next();
  };
};

export default validate;