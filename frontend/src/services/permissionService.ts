const API_URL = import.meta.env.VITE_API_URL || "/api";

export const permissionService = {
  findAll: async () => {
    const res = await fetch(`${API_URL}/permissions`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("admin_token")}` },
    });
    if (!res.ok) throw new Error("Failed to fetch permissions");
    const json = await res.json();
    return json.data;
  },

  create: async (data: any) => {
    const res = await fetch(`${API_URL}/permissions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to create permission");
    const json = await res.json();
    return json.data;
  },

  update: async (id: string, data: any) => {
    const res = await fetch(`${API_URL}/permissions/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update permission");
    const json = await res.json();
    return json.data;
  },

  remove: async (id: string) => {
    const res = await fetch(`${API_URL}/permissions/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${localStorage.getItem("admin_token")}` },
    });
    if (!res.ok) throw new Error("Failed to delete permission");
    const json = await res.json();
    return json.data;
  },
};
