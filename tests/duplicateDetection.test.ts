/**
 * tests/duplicateDetection.test.ts
 * --------------------------------
 * Unit tests for phone/email normalization and duplicate lead detection.
 */

import { describe, it, expect } from "vitest";
import {
  normalizePhone,
  normalizeEmail,
  findDuplicates,
} from "../server/utils/duplicateDetection";
import type { DBState } from "../server/repositories/db";

describe("normalizePhone", () => {
  it("should strip spaces, hyphens, and country codes formatting", () => {
    expect(normalizePhone("+91 98765-43210")).toBe("919876543210");
    expect(normalizePhone("098765 43210")).toBe("09876543210");
  });

  it("should return empty string if digits count is less than 7", () => {
    expect(normalizePhone("12345")).toBe("");
    expect(normalizePhone("")).toBe("");
  });
});

describe("normalizeEmail", () => {
  it("should lowercase and trim spaces", () => {
    expect(normalizeEmail("  Rajesh@SupremeBuilders.in ")).toBe(
      "rajesh@supremebuilders.in"
    );
  });
});

describe("findDuplicates", () => {
  const db: DBState = {
    leads: [
      {
        id: "l1",
        name: "Rajesh Singhania",
        phone: "+91 98765 43210",
        email: "singhania@supremebuilders.in",
        stage: "new",
        source: "Meta",
        createdAt: "",
        companyName: "",
        score: 0,
        value: 0,
      },
    ],
    assessments: [],
    conversations: [],
    projects: [],
    quotes: [],
  };

  it("should detect duplicate by phone number", () => {
    const matches = findDuplicates(db, "+91-98765-43210", "different@email.com");
    expect(matches).toHaveLength(1);
    expect(matches[0].id).toBe("l1");
    expect(matches[0].matchedOn).toBe("phone");
  });

  it("should detect duplicate by email", () => {
    const matches = findDuplicates(db, "+91 00000 00000", "SINGHANIA@supremebuilders.in");
    expect(matches).toHaveLength(1);
    expect(matches[0].matchedOn).toBe("email");
  });

  it("should exclude specified lead ID during edit mode checks", () => {
    const matches = findDuplicates(db, "+91 98765 43210", "singhania@supremebuilders.in", "l1");
    expect(matches).toHaveLength(0);
  });
});
