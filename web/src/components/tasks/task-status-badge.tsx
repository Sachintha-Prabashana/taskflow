import { Badge } from "@/components/ui/badge"
import { TaskStatus } from "@/types/task.types"

interface TaskStatusBadgeProps {
  status: TaskStatus
}

export function TaskStatusBadge({ status }: TaskStatusBadgeProps) {
  switch (status) {
    case "TODO":
      return <Badge variant="todo">To Do</Badge>
    case "IN_PROGRESS":
      return <Badge variant="inProgress">In Progress</Badge>
    case "DONE":
      return <Badge variant="done">Done</Badge>
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}

