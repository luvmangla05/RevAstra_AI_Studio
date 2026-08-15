/**
 * tests/taskUtils.test.ts
 * -----------------------
 * Unit tests for task overdue calculation and status display logic.
 */

import { describe, it, expect } from "vitest";
import { isTaskOverdue, getEffectiveStatus, sortTasks } from "../src/utils/taskUtils";
import type { Task } from "../src/types";

describe("isTaskOverdue", () => {
  it("should return false for completed tasks even if due date is in the past", () => {
    const task: Task = {
      id: "t1",
      title: "Past completed task",
      dueDate: "2020-01-01",
      dueTime: "10:00",
      priority: "high",
      status: "completed",
      createdAt: "2020-01-01T00:00:00.000Z",
      type: "call",
    };
    expect(isTaskOverdue(task)).toBe(false);
  });

  it("should return true for pending task with due date in the past", () => {
    const task: Task = {
      id: "t2",
      title: "Past pending task",
      dueDate: "2020-01-01",
      dueTime: "10:00",
      priority: "high",
      status: "pending",
      createdAt: "2020-01-01T00:00:00.000Z",
      type: "whatsapp",
    };
    expect(isTaskOverdue(task)).toBe(true);
  });

  it("should return false for pending task with due date in the far future", () => {
    const task: Task = {
      id: "t3",
      title: "Future pending task",
      dueDate: "2099-12-31",
      dueTime: "23:59",
      priority: "low",
      status: "pending",
      createdAt: new Date().toISOString(),
      type: "site_visit",
    };
    expect(isTaskOverdue(task)).toBe(false);
  });
});

describe("getEffectiveStatus", () => {
  it("should return 'completed' for completed tasks", () => {
    const task: Task = {
      id: "t1",
      title: "Done",
      dueDate: "2020-01-01",
      priority: "medium",
      status: "completed",
      createdAt: "",
      type: "other",
    };
    expect(getEffectiveStatus(task)).toBe("completed");
  });

  it("should return 'overdue' for past pending tasks", () => {
    const task: Task = {
      id: "t2",
      title: "Overdue",
      dueDate: "2020-01-01",
      priority: "high",
      status: "pending",
      createdAt: "",
      type: "other",
    };
    expect(getEffectiveStatus(task)).toBe("overdue");
  });
});

describe("sortTasks", () => {
  it("should place overdue tasks first, pending second, completed last", () => {
    const tasks: Task[] = [
      {
        id: "t_completed",
        title: "Completed",
        dueDate: "2020-01-01",
        priority: "low",
        status: "completed",
        createdAt: "",
        type: "other",
      },
      {
        id: "t_overdue",
        title: "Overdue",
        dueDate: "2020-01-01",
        priority: "high",
        status: "pending",
        createdAt: "",
        type: "other",
      },
      {
        id: "t_future",
        title: "Future",
        dueDate: "2099-01-01",
        priority: "medium",
        status: "pending",
        createdAt: "",
        type: "other",
      },
    ];

    const sorted = sortTasks(tasks);
    expect(sorted[0].id).toBe("t_overdue");
    expect(sorted[1].id).toBe("t_future");
    expect(sorted[2].id).toBe("t_completed");
  });
});
