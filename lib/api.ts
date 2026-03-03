const API = process.env.NEXT_PUBLIC_API_URL;

function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("blog_token");
}

async function request(path: string, options: RequestInit = {}) {
  const token = getToken();
  const res = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Request failed" }));
    throw new Error(err.error || "Request failed");
  }
  return res.json();
}

export const api = {
  // Auth
  login: (email: string, password: string) =>
    request("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  // Posts
  getAllPosts: () => request("/api/posts/all"),
  getPost: (slug: string) => request(`/api/posts/${slug}`),
  createPost: (data: object) =>
    request("/api/posts", { method: "POST", body: JSON.stringify(data) }),
  updatePost: (id: string, data: object) =>
    request(`/api/posts/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deletePost: (id: string) =>
    request(`/api/posts/${id}`, { method: "DELETE" }),

  // Upload
  uploadImage: async (file: File) => {
    const token = getToken();
    const form = new FormData();
    form.append("image", file);
    const res = await fetch(`${API}/api/upload`, {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: form,
    });
    if (!res.ok) throw new Error("Upload failed");
    return res.json();
  },
};
