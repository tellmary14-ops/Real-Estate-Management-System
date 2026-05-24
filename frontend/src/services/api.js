import axios from "axios";
import { appConfig } from "../config";
import { logger } from "../utils/logger";

const api = axios.create({
  baseURL: appConfig.apiBaseUrl,
});

function authHeaders(extra = {}) {
  const token = localStorage.getItem("accessToken");
  const headers = { ...extra };
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

/** Native fetch for multipart — avoids axios Content-Type bugs that drop form fields. */
async function apiFetch(path, { method = "GET", body, json } = {}) {
  const headers = authHeaders();
  let payload = body;

  if (json !== undefined) {
    headers["Content-Type"] = "application/json";
    payload = JSON.stringify(json);
  }

  const url = `${appConfig.apiBaseUrl}${path}`;
  logger.info("api:fetch", { method, url, multipart: body instanceof FormData });

  const res = await fetch(url, { method, headers, body: payload, credentials: "include" });
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    logger.error("api:fetch:error", data?.message ?? res.status);
    const err = new Error(data?.message ?? "Request failed");
    err.response = { status: res.status, data };
    throw err;
  }

  logger.info("api:fetch:ok", { method, url, status: res.status });
  return { data, status: res.status };
}

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  if (config.data && typeof config.data === "object" && !(config.data instanceof FormData)) {
    config.headers["Content-Type"] = "application/json";
  }
  logger.info("api:request", { url: config.url, method: config.method });
  return config;
});

api.interceptors.response.use(
  (res) => {
    logger.info("api:response", { url: res.config.url, status: res.status });
    return res;
  },
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && original && !original._retry) {
      original._retry = true;
      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        try {
          const { data } = await axios.post(`${appConfig.apiBaseUrl}/auth/refresh`, {
            refreshToken,
          });
          localStorage.setItem("accessToken", data.data.accessToken);
          localStorage.setItem("refreshToken", data.data.refreshToken);
          original.headers.Authorization = `Bearer ${data.data.accessToken}`;
          return api(original);
        } catch {
          localStorage.clear();
          window.location.href = "/login";
        }
      }
    }
    logger.error("api:error", error.response?.data?.message);
    return Promise.reject(error);
  }
);

export default api;

export const authApi = {
  register: (body) => api.post("/auth/register", body),
  login: (body) => api.post("/auth/login", body),
  logout: () => api.post("/auth/logout", { refreshToken: localStorage.getItem("refreshToken") }),
  me: () => api.get("/auth/me"),
};

export const propertyApi = {
  list: (params) =>
    api.get("/properties", {
      params: { ...params, _: Date.now() },
    }),
  get: (id) => api.get(`/properties/${id}`),
  create: (body) =>
    body instanceof FormData
      ? apiFetch("/properties", { method: "POST", body })
      : apiFetch("/properties", { method: "POST", json: body }),
  update: (id, body) =>
    body instanceof FormData
      ? apiFetch(`/properties/${id}`, { method: "PATCH", body })
      : apiFetch(`/properties/${id}`, { method: "PATCH", json: body }),
  remove: (id) => api.delete(`/properties/${id}`),
};

export const favoriteApi = {
  list: () => api.get("/favorites"),
  add: (propertyId) => api.post(`/favorites/${propertyId}`),
  remove: (propertyId) => api.delete(`/favorites/${propertyId}`),
};

export const reservationApi = {
  mine: () => api.get("/reservations/mine"),
  create: (body) => api.post("/reservations", body),
  listAll: (params) => api.get("/reservations", { params }),
  updateStatus: (id, status) => api.patch(`/reservations/${id}/status`, { status }),
};

export const paymentApi = {
  mine: () => api.get("/payments/mine"),
  initialize: (propertyId) => api.post("/payments/initialize", { propertyId }),
  simulate: (reference) => api.post("/payments/simulate", { reference }),
  listAll: (params) => api.get("/payments", { params }),
};

export const notificationApi = {
  list: () => api.get("/notifications"),
  markRead: (id) => api.patch(`/notifications/${id}/read`),
  markAllRead: () => api.patch("/notifications/read-all"),
};

export const analyticsApi = {
  dashboard: () => api.get("/analytics/dashboard"),
};

export const userApi = {
  list: (params) => api.get("/users", { params }),
};

export const reviewApi = {
  list: (propertyId) => api.get(`/reviews/property/${propertyId}`),
  create: (body) => api.post("/reviews", body),
};

export const purchaseApi = {
  mine: () => api.get("/purchases/mine"),
};
