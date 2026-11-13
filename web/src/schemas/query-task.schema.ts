import { z } from "zod";

export const queryTaskSchema = z.object({
  status: z.enum(["ALL", "TODO", "IN_PROGRESS", "DONE"]).default("ALL"),
  sortBy: z.enum(["dueDate", "createdAt", "title"]).default("dueDate"),
  order: z.enum(["asc", "desc"]).default("desc"),
});

export type TaskQueryFilters = z.infer<typeof queryTaskSchema>;

export function sanitizeQueryFilters(
  filters?: Partial<TaskQueryFilters>
): Record<string, string> {
  const queryParams: Record<string, string> = {};
  if (!filters) return queryParams;

  const parsed = queryTaskSchema.partial().safeParse(filters);
  if (!parsed.success) return queryParams;

  const validData = parsed.data;
  if (validData.status && validData.status !== "ALL") {
    queryParams.status = validData.status;
  }
  if (validData.sortBy) {
    queryParams.sortBy = validData.sortBy;
  }
  if (validData.order) {
    queryParams.order = validData.order;
  }

  return queryParams;
}
