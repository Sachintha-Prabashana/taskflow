import { z } from "zod";

export * from "./create-task.schema";
export * from "./update-task.schema";
export * from "./query-task.schema";

export function formatZodErrors(error: z.ZodError): Record<string, string> {
  const fieldErrors: Record<string, string> = {};
  for (const issue of error.issues) {
    const field = issue.path[0]?.toString() || "form";
    if (!fieldErrors[field]) {
      fieldErrors[field] = issue.message;
    }
  }
  return fieldErrors;
}
