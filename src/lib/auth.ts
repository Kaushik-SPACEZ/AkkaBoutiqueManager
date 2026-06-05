import type { AuthUser } from "@/types";

const KEY = "boutiqueos.auth";

const ADMIN: AuthUser = {
  email: "admin@boutiqueos.com",
  name: "Saranya (Owner)",
  role: "admin",
};

const STAFF: AuthUser = {
  email: "staff@boutiqueos.com",
  name: "Priya (Staff)",
  role: "staff",
};

export function login(email: string, password: string): AuthUser | null {
  const e = email.trim().toLowerCase();
  if (password !== "demo123") return null;
  if (e === ADMIN.email) {
    localStorage.setItem(KEY, JSON.stringify(ADMIN));
    return ADMIN;
  }
  if (e === STAFF.email) {
    localStorage.setItem(KEY, JSON.stringify(STAFF));
    return STAFF;
  }
  return null;
}

export function getCurrentUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export function logout() {
  localStorage.removeItem(KEY);
}
