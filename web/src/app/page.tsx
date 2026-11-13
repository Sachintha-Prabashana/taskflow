"use client"

import * as React from "react"
import { AlertCircle, CheckSquare, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TaskDeleteDialog } from "@/components/tasks/task-delete-dialog"
import { TaskEmptyState } from "@/components/tasks/task-empty-state"
import { TaskFilterBar } from "@/components/tasks/task-filter-bar"
import { TaskFormDialog } from "@/components/tasks/task-form-dialog"
import { TaskTable } from "@/components/tasks/task-table"
import { useTasks } from "@/hooks/use-tasks"

export default function TasksPage() {
  const {
    tasks,
    isLoading,
    error,
    statusFilter,
    setStatusFilter,
    sortOrder,
    toggleSortOrder,
    isFormOpen,
    setIsFormOpen,
    editingTask,
    openCreateDialog,
    openEditDialog,
    handleCreateTask,
    handleUpdateTask,
    isDeleteOpen,
    setIsDeleteOpen,
    deletingTask,
    isDeleting,
    openDeleteDialog,
    handleDeleteTask,
    refreshTasks,
  } = useTasks()

  const hasActiveFilter = statusFilter !== "ALL"

  return (
    <main className="min-h-screen bg-muted/20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center size-10 rounded-xl bg-primary text-primary-foreground shadow-sm">
              <CheckSquare className="size-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                TaskFlow
              </h1>
              <p className="text-sm text-muted-foreground">
                Manage, prioritize, and track your tasks efficiently
              </p>
            </div>
          </div>
        </header>

        {/* Error Banner */}
        {error && (
          <div className="flex items-center justify-between p-4 mb-6 rounded-xl border border-destructive/30 bg-destructive/10 text-destructive text-sm">
            <div className="flex items-center gap-2.5">
              <AlertCircle className="size-4 shrink-0" />
              <span>{error}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={refreshTasks}
              className="gap-1.5 shrink-0"
            >
              <RefreshCw className="size-3.5" />
              <span>Retry</span>
            </Button>
          </div>
        )}

        {/* Main Content Card */}
        <div className="bg-background rounded-2xl border shadow-xs p-4 sm:p-6 space-y-4">
          {/* Controls Bar */}
          <TaskFilterBar
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            sortOrder={sortOrder}
            onToggleSortOrder={toggleSortOrder}
            onCreateClick={openCreateDialog}
            totalCount={tasks.length}
          />

          {/* Table or Empty State */}
          {!isLoading && tasks.length === 0 ? (
            <TaskEmptyState
              hasFilters={hasActiveFilter}
              onCreateClick={openCreateDialog}
              onClearFilters={() => setStatusFilter("ALL")}
            />
          ) : (
            <TaskTable
              tasks={tasks}
              isLoading={isLoading}
              onEdit={openEditDialog}
              onDelete={openDeleteDialog}
            />
          )}
        </div>
      </div>

      {/* Create / Edit Dialog */}
      <TaskFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        taskToEdit={editingTask}
        onSubmitCreate={handleCreateTask}
        onSubmitUpdate={handleUpdateTask}
      />

      {/* Delete Confirmation Dialog */}
      <TaskDeleteDialog
        task={deletingTask}
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        onConfirm={handleDeleteTask}
        isDeleting={isDeleting}
      />
    </main>
  )
}
