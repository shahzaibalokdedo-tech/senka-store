export interface AuthUser {
  id?: string;
  email: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  role: "customer" | "admin";
}

const TOKEN_KEY = "senka_auth_token";
const USER_KEY = "senka_auth_user";
const TIME_KEY = "senka_auth_time";

const SESSION_TTL_MS = 24 * 60 * 60 * 1000; // 24 Hour TTL


export function setSession(token: string, user: AuthUser) {
  if (typeof window !== "undefined") {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    localStorage.setItem(TIME_KEY, Date.now().toString());
  }
}

export function getSession(): { token: string | null; user: AuthUser | null } {
  if (typeof window === "undefined") return { token: null, user: null };

  const timeStr = localStorage.getItem(TIME_KEY);
  if (timeStr) {
    const loginTime = parseInt(timeStr, 10);
    const elapsed = Date.now() - loginTime;
    if (elapsed >= SESSION_TTL_MS) {
      console.warn("Session expired after 1 hour — logging out");
      clearSession();
      return { token: null, user: null };
    }
  }

  const token = localStorage.getItem(TOKEN_KEY);
  const userStr = localStorage.getItem(USER_KEY);
  let user: AuthUser | null = null;
  if (userStr) {
    try {
      user = JSON.parse(userStr);
    } catch {
      user = null;
    }
  }
  return { token, user };
}

export function clearSession() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(TIME_KEY);
  }
}

export function isAdmin(): boolean {
  const { user } = getSession();
  return user?.role === "admin";
}
