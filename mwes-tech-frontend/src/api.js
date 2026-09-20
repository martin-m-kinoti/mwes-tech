const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

function getToken() {
  return localStorage.getItem("mwes_token");
}

async function request(path, { method = "GET", body } = {}) {
  const headers = { "Content-Type": "application/json" };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (res.status === 401 && token) {
    localStorage.removeItem("mwes_token");
    localStorage.removeItem("mwes_user");
    if (window.location.pathname !== "/signin") {
      window.location.assign("/signin");
    }
    const err = new Error("Your session has expired. Please sign in again.");
    err.status = 401;
    throw err;
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.message || "Request failed. Please try again.");
    err.status = res.status;
    throw err;
  }
  return data;
}

export const api = {
  get: (path) => request(path),
  post: (path, body) => request(path, { method: "POST", body }),
  patch: (path, body) => request(path, { method: "PATCH", body }),
  del: (path) => request(path, { method: "DELETE" }),
  getToken,
};