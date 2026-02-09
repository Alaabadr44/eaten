const API_URL = import.meta.env.VITE_API_URL || "/api";

export const systemLogService = {
  findAll: async (page = 1, limit = 20) => {
    const res = await fetch(`${API_URL}/system-logs?page=${page}&limit=${limit}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("admin_token")}` },
    });
    if (!res.ok) throw new Error("Failed to fetch system logs");
    const json = await res.json();
    return json.data;
  },
};
