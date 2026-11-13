"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Task } from "@/types/task.types"

interface TaskDeleteDialogProps {
  task: Task | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (id: number) => Promise<void>
  isDeleting: boolean
}

export function TaskDeleteDialog({
  task,
  open,
  onOpenChange,
  onConfirm,
  isDeleting,
}: TaskDeleteDialogProps) {
  if (!task) return null

  const handleConfirm = async () => {
    await onConfirm(task.id)
    onOpenChange(false)
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Task</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete{" "}
            <span className="font-semibold text-foreground">
              &quot;{task.title}&quot;
            </span>
            ? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm} disabled={isDeleting}>
            {isDeleting ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

