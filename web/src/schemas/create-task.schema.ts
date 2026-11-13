import { z } from "zod";

export const createTaskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(255, "Title must not exceed 255 characters"),
  description: z
    .string()
    .trim()
    .max(1000, "Description must not exceed 1000 characters")
    .optional()
    .nullable()
    .or(z.literal("")),
  status: z.enum(["TODO", "IN_PROGRESS", "DONE"]).default("TODO"),
  dueDate: z
    .string()
    .datetime({ message: "Due date must be a valid ISO date" })
    .optional()
    .nullable()
    .or(z.literal("")),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
