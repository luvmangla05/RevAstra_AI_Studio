/**
 * src/utils/taskUtils.ts
 * ----------------------
 * Task utilities for overdue calculation and status display.
 *
 * Key fix: Overdue is calculated using BOTH dueDate AND dueTime,
 * not just dueDate. This means a task due at 11:00 AM on today's date
 * is only overdue after 11:00 AM passes, not at midnight.
 *
 * @license Apache-2.0
 */

import type { Task } from "../types";

/**
 * Returns true if a task is currently overdue.
 *
 * Rules:
 * - Completed tasks are NEVER overdue.
 * - If dueTime is provided, overdue only after that exact time passes.
 * - If no dueTime, overdue at end of the due date day (23:59:59).
 */
export function isTaskOverdue(task: Task): boolean {
  if (task.status === "completed") return false;

  const timeStr = task.dueTime || "23:59:59";
  // Construct a local datetime from YYYY-MM-DD + HH:MM
  const dueDateTimeStr = `${task.dueDate}T${timeStr}`;
  const dueDateTime = new Date(dueDateTimeStr);

  // Guard against invalid dates
  if (isNaN(dueDateTime.getTime())) return false;

  return dueDateTime < new Date();
}

/**
 * Returns the effective display status for a task.
 * Applies the overdue check on top of stored status.
 */
export function getEffectiveStatus(task: Task): "pending" | "completed" | "overdue" {
  if (task.status === "completed") return "completed";
  if (isTaskOverdue(task)) return "overdue";
  return "pending";
}

/**
 * Format a due date + time for human display.
 * Returns a string like "Today 11:00 AM", "Tomorrow 3:00 PM", or "15 Aug, 2:00 PM"
 */
export function formatDueDateTime(dueDate: string, dueTime?: string): string {
  const today = new Date().toISOString().split("T")[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0];

  const timeStr = dueTime
    ? formatTime12h(dueTime)
    : "";

  const timeDisplay = timeStr ? ` ${timeStr}` : "";

  if (dueDate === today) return `Today${timeDisplay}`;
  if (dueDate === tomorrow) return `Tomorrow${timeDisplay}`;

  const d = new Date(`${dueDate}T00:00:00`);
  const formatted = d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  return `${formatted}${timeDisplay}`;
}

/** Convert HH:MM to 12-hour format with AM/PM */
function formatTime12h(time: string): string {
  const [hStr, mStr] = time.split(":");
  const h = parseInt(hStr, 10);
  const m = mStr || "00";
  const period = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 || 12;
  return `${h12}:${m} ${period}`;
}

/**
 * Sort tasks: overdue first, then by due date ascending, completed last.
 */
export function sortTasks(tasks: Task[]): Task[] {
  return [...tasks].sort((a, b) => {
    const statusA = getEffectiveStatus(a);
    const statusB = getEffectiveStatus(b);

    // Completed always last
    if (statusA === "completed" && statusB !== "completed") return 1;
    if (statusB === "completed" && statusA !== "completed") return -1;

    // Overdue first
    if (statusA === "overdue" && statusB !== "overdue") return -1;
    if (statusB === "overdue" && statusA !== "overdue") return 1;

    // Sort by due date ascending
    const dateA = new Date(`${a.dueDate}T${a.dueTime || "23:59:59"}`).getTime();
    const dateB = new Date(`${b.dueDate}T${b.dueTime || "23:59:59"}`).getTime();
    return dateA - dateB;
  });
}
