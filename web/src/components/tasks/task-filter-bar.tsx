"use client"

import { ArrowDownAZ, ArrowUpZA, Plus, SlidersHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select } from "@/components/ui/select"
import { TaskFilterStatus, TaskSortOrder } from "@/types/task.types"

interface TaskFilterBarProps {
  statusFilter: TaskFilterStatus
  onStatusFilterChange: (status: TaskFilterStatus) => void
  sortOrder: TaskSortOrder
  onToggleSortOrder: () => void
  onCreateClick: () => void
  totalCount: number
}

export function TaskFilterBar({
  statusFilter,
  onStatusFilterChange,
  sortOrder,
  onToggleSortOrder,
  onCreateClick,
  totalCount,
}: TaskFilterBarProps) {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 py-4 border-b">
      <div className="flex flex-wrap items-center gap-3">
        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="size-4 text-muted-foreground hidden sm:block" />
          <div className="w-40">
            <Select
              value={statusFilter}
              onChange={(e) =>
                onStatusFilterChange(e.target.value as TaskFilterStatus)
              }
            >
              <option value="ALL">All Statuses</option>
              <option value="TODO">To Do</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="DONE">Done</option>
            </Select>
          </div>
        </div>

        {/* Due Date Sort Button */}
        <Button
          variant="outline"
          size="default"
          onClick={onToggleSortOrder}
          className="gap-2"
        >
          {sortOrder === "asc" ? (
            <>
              <ArrowDownAZ className="size-4" />
              <span>Due: Earliest First</span>
            </>
          ) : (
            <>
              <ArrowUpZA className="size-4" />
              <span>Due: Latest First</span>
            </>
          )}
        </Button>

        <span className="text-xs text-muted-foreground hidden md:inline-block">
          ({totalCount} {totalCount === 1 ? "task" : "tasks"})
        </span>
      </div>

      {/* Primary Action Button */}
      <Button onClick={onCreateClick} className="gap-2 shrink-0">
        <Plus className="size-4" />
        <span>Create Task</span>
      </Button>
    </div>
  )
}

