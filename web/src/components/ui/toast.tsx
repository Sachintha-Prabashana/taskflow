"use client"

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react"
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react"
import { cn } from "@/lib/utils"

export type ToastType = "success" | "error" | "info"

export interface ToastItem {
  id: string
  title?: string
  description?: string
  type: ToastType
}

interface ToastContextValue {
  toasts: ToastItem[]
  showToast: (options: { title?: string; description?: string; type?: ToastType }) => void
  dismissToast: (id: string) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const showToast = useCallback(
    ({
      title,
      description,
      type = "info",
    }: {
      title?: string
      description?: string
      type?: ToastType
    }) => {
      const id = Math.random().toString(36).substring(2, 9)
      const newToast: ToastItem = { id, title, description, type }

      setToasts((prev) => [...prev, newToast])

      setTimeout(() => {
        dismissToast(id)
      }, 4000)
    },
    [dismissToast]
  )

  return (
    <ToastContext.Provider value={{ toasts, showToast, dismissToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-md w-full pointer-events-none p-4">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={cn(
              "pointer-events-auto flex items-start gap-3 rounded-lg border p-4 shadow-lg transition-all duration-300 animate-in slide-in-from-bottom-5",
              toast.type === "success" &&
                "bg-emerald-50 border-emerald-200 text-emerald-950 dark:bg-emerald-950/80 dark:border-emerald-800 dark:text-emerald-100",
              toast.type === "error" &&
                "bg-red-50 border-red-200 text-red-950 dark:bg-red-950/80 dark:border-red-800 dark:text-red-100",
              toast.type === "info" &&
                "bg-background border-border text-foreground"
            )}
          >
            {toast.type === "success" && (
              <CheckCircle2 className="size-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            )}
            {toast.type === "error" && (
              <AlertCircle className="size-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
            )}
            {toast.type === "info" && (
              <Info className="size-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
            )}

            <div className="flex-1 space-y-1">
              {toast.title && (
                <div className="text-sm font-semibold">{toast.title}</div>
              )}
              {toast.description && (
                <div className="text-xs opacity-90">{toast.description}</div>
              )}
            </div>

            <button
              type="button"
              onClick={() => dismissToast(toast.id)}
              className="text-muted-foreground hover:text-foreground rounded-xs opacity-70 transition-opacity hover:opacity-100"
            >
              <X className="size-4" />
              <span className="sr-only">Close</span>
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToastContext() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error("useToastContext must be used within a ToastProvider")
  }
  return context
}
