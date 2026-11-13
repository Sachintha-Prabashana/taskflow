"use client"

import { Calendar, Edit2, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { TaskStatusBadge } from "./task-status-badge"
import { Task } from "@/types/task.types"

interface TaskTableProps {
  tasks: Task[]
  isLoading: boolean
  onEdit: (task: Task) => void
  onDelete: (task: Task) => void
}

function formatDate(dateString: string | null): string {
  if (!dateString) return "—"
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  } catch {
    return dateString
  }
}

export function TaskTable({
  tasks,
  isLoading,
  onEdit,
  onDelete,
}: TaskTableProps) {
  if (isLoading) {
    return (
      <div className="border rounded-xl overflow-hidden bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">ID</TableHead>
              <TableHead>Title & Description</TableHead>
              <TableHead className="w-36">Status</TableHead>
              <TableHead className="w-40">Due Date</TableHead>
              <TableHead className="w-28 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 4 }).map((_, index) => (
              <TableRow key={index} className="animate-pulse">
                <TableCell>
                  <div className="h-4 w-6 bg-muted rounded-xs" />
                </TableCell>
                <TableCell>
                  <div className="h-4 w-48 bg-muted rounded-xs mb-1.5" />
                  <div className="h-3 w-64 bg-muted/60 rounded-xs" />
                </TableCell>
                <TableCell>
                  <div className="h-5 w-20 bg-muted rounded-full" />
                </TableCell>
                <TableCell>
                  <div className="h-4 w-24 bg-muted rounded-xs" />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <div className="size-8 bg-muted rounded-md" />
                    <div className="size-8 bg-muted rounded-md" />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    )
  }

  return (
    <div className="border rounded-xl overflow-hidden bg-background shadow-xs">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16">#</TableHead>
            <TableHead>Task</TableHead>
            <TableHead className="w-36">Status</TableHead>
            <TableHead className="w-40">Due Date</TableHead>
            <TableHead className="w-28 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((task) => (
            <TableRow key={task.id} className="group">
              <TableCell className="font-mono text-xs text-muted-foreground">
                {task.id}
              </TableCell>

              <TableCell>
                <div className="font-medium text-foreground">{task.title}</div>
                {task.description && (
                  <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5 max-w-md">
                    {task.description}
                  </p>
                )}
              </TableCell>

              <TableCell>
                <TaskStatusBadge status={task.status} />
              </TableCell>

              <TableCell>
                {task.dueDate ? (
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Calendar className="size-3.5" />
                    <span>{formatDate(task.dueDate)}</span>
                  </div>
                ) : (
                  <span className="text-xs text-muted-foreground/60">—</span>
                )}
              </TableCell>

              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => onEdit(task)}
                    title="Edit task"
                    className="opacity-70 group-hover:opacity-100"
                  >
                    <Edit2 className="size-3.5" />
                    <span className="sr-only">Edit</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => onDelete(task)}
                    title="Delete task"
                    className="opacity-70 group-hover:opacity-100 hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="size-3.5" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

