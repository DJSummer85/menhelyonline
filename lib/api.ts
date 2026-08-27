const API_BASE = typeof window !== "undefined"
  ? (window.location.port === "3002" ? "http://localhost:3003" : "/api")
  : "http://localhost:3003";

async function fetchAPI(endpoint: string, options?: RequestInit) {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((options?.headers as Record<string, string>) || {}),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Hiba történt");
  return data;
}

// ── Auth ──
export async function register(email: string, password: string, name: string, role = "user") {
  const data = await fetchAPI("/auth/register", {
    method: "POST",
    body: JSON.stringify({ email, password, name, role }),
  });
  // Email visszaigazolás esetén NE tároljunk token-t
  if (data.requiresVerification) {
    return data;
  }
  if (typeof window !== "undefined" && data.token) {
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
  }
  return data;
}

export async function login(email: string, password: string) {
  const data = await fetchAPI("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  if (typeof window !== "undefined") {
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
  }
  return data;
}

export function logout() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }
}

export function getUser() {
  if (typeof window === "undefined") return null;
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
}

// ── Stats ──
export async function getStats() {
  return fetchAPI("/stats");
}

// ── Animals ──
export async function getAnimals(params?: { species?: string; shelter_id?: number }) {
  const query = new URLSearchParams();
  if (params?.species) query.set("species", params.species);
  if (params?.shelter_id) query.set("shelter_id", String(params.shelter_id));
  const qs = query.toString();
  return fetchAPI(`/animals${qs ? `?${qs}` : ""}`);
}

export async function getAnimal(id: number) {
  return fetchAPI(`/animals/${id}`);
}

export async function createAnimal(animal: any) {
  return fetchAPI("/animals", {
    method: "POST",
    body: JSON.stringify(animal),
  });
}

// ── Shelters ──
export async function getShelters() {
  return fetchAPI("/shelters");
}

export async function getMyShelter() {
  return fetchAPI("/shelters/mine");
}

export async function createShelter(shelter: any) {
  return fetchAPI("/shelters", {
    method: "POST",
    body: JSON.stringify(shelter),
  });
}

// ── Adoptions ──
export async function applyForAdoption(animalId: number, message?: string) {
  return fetchAPI("/adoptions", {
    method: "POST",
    body: JSON.stringify({ animal_id: animalId, message }),
  });
}

export async function getMyAdoptions() {
  return fetchAPI("/adoptions/mine");
}

export async function updateAdoption(id: number, status: "approved" | "rejected") {
  return fetchAPI(`/adoptions/${id}`, {
    method: "PUT",
    body: JSON.stringify({ status }),
  });
}
