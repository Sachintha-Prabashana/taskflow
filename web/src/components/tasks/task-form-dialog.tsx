"use client"

import { type FormEvent, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { createTaskSchema, formatZodErrors, updateTaskSchema } from "@/schemas"
import { CreateTaskInput, Task, TaskStatus, UpdateTaskInput } from "@/types/task.types"

interface TaskFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  taskToEdit?: Task | null
  onSubmitCreate: (data: CreateTaskInput) => Promise<void>
  onSubmitUpdate: (id: number, data: UpdateTaskInput) => Promise<void>
}

export function TaskFormDialog({
  open,
  onOpenChange,
  taskToEdit,
  onSubmitCreate,
  onSubmitUpdate,
}: TaskFormDialogProps) {
  const isEditMode = Boolean(taskToEdit)

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [status, setStatus] = useState<TaskStatus>("TODO")
  const [dueDate, setDueDate] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Populate form fields when taskToEdit changes or dialog opens
  useEffect(() => {
    if (taskToEdit && open) {
      setTitle(taskToEdit.title)
      setDescription(taskToEdit.description || "")
      setStatus(taskToEdit.status)
      setDueDate(
        taskToEdit.dueDate
          ? new Date(taskToEdit.dueDate).toISOString().substring(0, 10)
          : ""
      )
    } else if (!taskToEdit && open) {
      setTitle("")
      setDescription("")
      setStatus("TODO")
      setDueDate("")
    }
    setErrors({})
    setIsSubmitting(false)
  }, [taskToEdit, open])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setErrors({})

    const formattedDueDate = dueDate ? new Date(dueDate).toISOString() : undefined

    if (isEditMode && taskToEdit) {
      const updateData = {
        title: title.trim(),
        description: description.trim() || undefined,
        status,
        dueDate: formattedDueDate,
      }

      const result = updateTaskSchema.safeParse(updateData)
      if (!result.success) {
        setErrors(formatZodErrors(result.error))
        return
      }

      try {
        setIsSubmitting(true)
        await onSubmitUpdate(taskToEdit.id, result.data)
        onOpenChange(false)
      } catch (err: unknown) {
        const errorMsg = err instanceof Error ? err.message : "Failed to update task"
        setErrors({ form: errorMsg })
      } finally {
        setIsSubmitting(false)
      }
    } else {
      const createData = {
        title: title.trim(),
        description: description.trim() || undefined,
        status,
        dueDate: formattedDueDate,
      }

      const result = createTaskSchema.safeParse(createData)
      if (!result.success) {
        setErrors(formatZodErrors(result.error))
        return
      }

      try {
        setIsSubmitting(true)
        await onSubmitCreate(result.data as CreateTaskInput)
        onOpenChange(false)
      } catch (err: unknown) {
        const errorMsg = err instanceof Error ? err.message : "Failed to create task"
        setErrors({ form: errorMsg })
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Edit Task" : "Create Task"}</DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Update task details below and save your changes."
              : "Fill out the fields below to create a new task."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          {errors.form && (
            <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 rounded-md">
              {errors.form}
            </div>
          )}

          {/* Title */}
          <div className="space-y-1.5">
            <Label htmlFor="task-title">
              Title <span className="text-red-500">*</span>
            </Label>
            <Input
              id="task-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Complete quarterly report"
              disabled={isSubmitting}
              autoFocus
            />
            {errors.title && (
              <p className="text-xs text-red-500">{errors.title}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label htmlFor="task-description">Description</Label>
            <Textarea
              id="task-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add optional notes, details, or context..."
              rows={3}
              disabled={isSubmitting}
            />
          </div>

          {/* Status & Due Date Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Status */}
            <div className="space-y-1.5">
              <Label htmlFor="task-status">Status</Label>
              <Select
                id="task-status"
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                disabled={isSubmitting}
              >
                <option value="TODO">To Do</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="DONE">Done</option>
              </Select>
            </div>

            {/* Due Date */}
            <div className="space-y-1.5">
              <Label htmlFor="task-due-date">Due Date</Label>
              <Input
                id="task-due-date"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                disabled={isSubmitting}
              />
              {errors.dueDate && (
                <p className="text-xs text-red-500">{errors.dueDate}</p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? "Saving..."
                : isEditMode
                ? "Save Changes"
                : "Create Task"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
