"use client"

import { useToastContext } from "@/components/ui/toast"

export function useToast() {
  const { showToast } = useToastContext()

  return {
    success: (title: string, description?: string) =>
      showToast({ title, description, type: "success" }),
    error: (title: string, description?: string) =>
      showToast({ title, description, type: "error" }),
    info: (title: string, description?: string) =>
      showToast({ title, description, type: "info" }),
  }
}

