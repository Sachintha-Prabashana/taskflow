import { ClipboardList, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

interface TaskEmptyStateProps {
  hasFilters: boolean
  onCreateClick?: () => void
  onClearFilters?: () => void
}

export function TaskEmptyState({
  hasFilters,
  onCreateClick,
  onClearFilters,
}: TaskEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center border rounded-xl border-dashed bg-muted/20 my-6">
      <div className="flex items-center justify-center size-12 rounded-full bg-muted mb-4 text-muted-foreground">
        <ClipboardList className="size-6" />
      </div>
      <h3 className="text-base font-semibold text-foreground">
        {hasFilters ? "No matching tasks found" : "No tasks yet"}
      </h3>
      <p className="text-sm text-muted-foreground mt-1 max-w-sm mb-6">
        {hasFilters
          ? "Try adjusting or clearing your status filter to see other tasks."
          : "Get started by creating your very first task to track your progress."}
      </p>
      {hasFilters ? (
        <Button variant="outline" size="sm" onClick={onClearFilters}>
          Clear Filter
        </Button>
      ) : (
        <Button onClick={onCreateClick} size="sm">
          <Plus className="size-4 mr-1.5" />
          Create Task
        </Button>
      )}
    </div>
  )
}

