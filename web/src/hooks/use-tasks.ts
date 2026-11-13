"use client"

import { useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useToast } from "@/hooks/use-toast"
import { taskApi } from "@/services/task-api"
import {
  CreateTaskInput,
  Task,
  TaskFilterStatus,
  TaskSortOrder,
  UpdateTaskInput,
} from "@/types/task.types"

export function useTasks() {
  const queryClient = useQueryClient()
  const toast = useToast()

  // Filters & Sorting state
  const [statusFilter, setStatusFilter] = useState<TaskFilterStatus>("ALL")
  const [sortOrder, setSortOrder] = useState<TaskSortOrder>("desc")

  // Modal Dialog states
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)

  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [deletingTask, setDeletingTask] = useState<Task | null>(null)

  // Query: Declarative task fetching with automated caching & deduplication
  const {
    data: tasks = [],
    isLoading,
    error: queryError,
    refetch,
  } = useQuery({
    queryKey: [
      "tasks",
      {
        status: statusFilter,
        sortBy: "dueDate",
        order: sortOrder,
      },
    ],
    queryFn: () =>
      taskApi.getTasks({
        status: statusFilter,
        sortBy: "dueDate",
        order: sortOrder,
      }),
  })

  // Mutation: Create task
  const createMutation = useMutation({
    mutationFn: (input: CreateTaskInput) => taskApi.createTask(input),
    onSuccess: (_, input) => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] })
      toast.success("Task created successfully", `"${input.title}" has been added.`)
    },
    onError: (err: unknown) => {
      const message = err instanceof Error ? err.message : "Failed to create task"
      toast.error("Creation failed", message)
    },
  })

  // Mutation: Update task
  const updateMutation = useMutation({
    mutationFn: ({ id, input }: { id: number; input: UpdateTaskInput }) =>
      taskApi.updateTask(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] })
      toast.success("Task updated successfully", "Your changes have been saved.")
    },
    onError: (err: unknown) => {
      const message = err instanceof Error ? err.message : "Failed to update task"
      toast.error("Update failed", message)
    },
  })

  // Mutation: Delete task
  const deleteMutation = useMutation({
    mutationFn: (id: number) => taskApi.deleteTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] })
      toast.success("Task deleted successfully", "The task has been permanently removed.")
    },
    onError: (err: unknown) => {
      const message = err instanceof Error ? err.message : "Failed to delete task"
      toast.error("Delete failed", message)
    },
  })

  // Dialog actions
  const openCreateDialog = () => {
    setEditingTask(null)
    setIsFormOpen(true)
  }

  const openEditDialog = (task: Task) => {
    setEditingTask(task)
    setIsFormOpen(true)
  }

  const openDeleteDialog = (task: Task) => {
    setDeletingTask(task)
    setIsDeleteOpen(true)
  }

  const handleCreateTask = async (input: CreateTaskInput) => {
    await createMutation.mutateAsync(input)
  }

  const handleUpdateTask = async (id: number, input: UpdateTaskInput) => {
    await updateMutation.mutateAsync({ id, input })
  }

  const handleDeleteTask = async (id: number) => {
    await deleteMutation.mutateAsync(id)
  }

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
  }

  const error = queryError
    ? queryError instanceof Error
      ? queryError.message
      : "Failed to load tasks"
    : null

  return {
    tasks,
    isLoading,
    error,
    statusFilter,
    setStatusFilter,
    sortOrder,
    toggleSortOrder,
    // Form Dialog
    isFormOpen,
    setIsFormOpen,
    editingTask,
    openCreateDialog,
    openEditDialog,
    handleCreateTask,
    handleUpdateTask,
    // Delete Dialog
    isDeleteOpen,
    setIsDeleteOpen,
    deletingTask,
    isDeleting: deleteMutation.isPending,
    openDeleteDialog,
    handleDeleteTask,
    // Utility
    refreshTasks: () => {
      refetch()
    },
  }
}
