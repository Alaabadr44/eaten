const API_URL = import.meta.env.VITE_API_URL || "/api";

export const adminService = {
  findAll: async () => {
    const res = await fetch(`${API_URL}/admins`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("admin_token")}` },
    });
    if (!res.ok) throw new Error("Failed to fetch admins");
    const json = await res.json();
    return json.data;
  },

  create: async (data: any) => {
    const res = await fetch(`${API_URL}/admins`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to create admin");
    const json = await res.json();
    return json.data;
  },

  update: async (id: string, data: any) => {
    const res = await fetch(`${API_URL}/admins/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update admin");
    const json = await res.json();
    return json.data;
  },

  remove: async (id: string) => {
    const res = await fetch(`${API_URL}/admins/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${localStorage.getItem("admin_token")}` },
    });
    if (!res.ok) throw new Error("Failed to delete admin");
    const json = await res.json();
    return json.data;
  },
};
