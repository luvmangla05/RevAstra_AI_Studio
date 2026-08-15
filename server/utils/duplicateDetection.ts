/**
 * server/utils/duplicateDetection.ts
 * -----------------------------------
 * Duplicate lead detection utilities.
 *
 * Checks incoming leads against existing database records using
 * normalized phone numbers and email addresses.
 *
 * Design decisions:
 * - Does NOT automatically merge or destroy data
 * - Returns matches so the UI can warn the user and let them decide
 * - Phone normalization strips all non-digit characters for comparison
 * - Email normalization lowercases for comparison
 *
 * @license Apache-2.0
 */

import type { DBState } from "../repositories/db.js";

export interface DuplicateMatch {
  id: string;
  name: string;
  phone: string;
  email: string;
  stage: string;
  matchedOn: "phone" | "email" | "both";
}

/**
 * Normalize a phone number for comparison.
 * Strips all non-digit characters.
 * Returns empty string if the result is fewer than 7 digits.
 */
export function normalizePhone(phone: string): string {
  if (!phone) return "";
  const digits = phone.replace(/\D/g, "");
  return digits.length >= 7 ? digits : "";
}

/**
 * Normalize an email for comparison.
 */
export function normalizeEmail(email: string): string {
  if (!email) return "";
  return email.trim().toLowerCase();
}

/**
 * Find potential duplicate leads in the database.
 *
 * @param db        Current database state
 * @param phone     Phone number to check (will be normalized)
 * @param email     Email address to check (will be normalized)
 * @param excludeId Lead ID to exclude from comparison (used during edit)
 * @returns         Array of matching leads with match reason
 */
export function findDuplicates(
  db: DBState,
  phone: string,
  email: string,
  excludeId?: string
): DuplicateMatch[] {
  const normalizedPhone = normalizePhone(phone);
  const normalizedEmail = normalizeEmail(email);

  if (!normalizedPhone && !normalizedEmail) return [];

  const matches: DuplicateMatch[] = [];

  for (const lead of db.leads || []) {
    if (excludeId && lead.id === excludeId) continue;

    const leadPhone = normalizePhone(lead.phone || "");
    const leadEmail = normalizeEmail(lead.email || "");

    const phoneMatch = normalizedPhone && leadPhone && leadPhone === normalizedPhone;
    const emailMatch = normalizedEmail && leadEmail && leadEmail === normalizedEmail;

    if (phoneMatch || emailMatch) {
      matches.push({
        id: lead.id,
        name: lead.name || "",
        phone: lead.phone || "",
        email: lead.email || "",
        stage: lead.stage || "new",
        matchedOn: phoneMatch && emailMatch ? "both" : phoneMatch ? "phone" : "email",
      });
    }
  }

  return matches;
}
