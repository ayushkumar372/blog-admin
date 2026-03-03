"use client";
import { useEffect, useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { api } from "@/lib/api";
import Link from "next/link";

interface Post {
  _id: string;
  title: string;
  slug: string;
  status: "draft" | "published";
  createdAt: string;
  views: number;
}

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = () => {
    api
      .getAllPosts()
      .then(setPosts)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"?`)) return;
    setDeleting(id);
    try {
      await api.deletePost(id);
      setPosts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      alert("Failed to delete");
    } finally {
      setDeleting(null);
    }
  };

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-white">All Posts</h1>
          <Link
            href="/posts/new"
            className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors"
          >
            + New Post
          </Link>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading...</div>
          ) : posts.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No posts found</div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800 text-left">
                  <th className="px-6 py-4 text-sm text-gray-400 font-medium">Title</th>
                  <th className="px-6 py-4 text-sm text-gray-400 font-medium">Status</th>
                  <th className="px-6 py-4 text-sm text-gray-400 font-medium">Views</th>
                  <th className="px-6 py-4 text-sm text-gray-400 font-medium">Date</th>
                  <th className="px-6 py-4 text-sm text-gray-400 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {posts.map((post) => (
                  <tr key={post._id} className="hover:bg-gray-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-white font-medium">{post.title}</p>
                      <p className="text-gray-500 text-sm">/blog/{post.slug}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                          post.status === "published"
                            ? "bg-green-400/10 text-green-400"
                            : "bg-yellow-400/10 text-yellow-400"
                        }`}
                      >
                        {post.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-300">{post.views}</td>
                    <td className="px-6 py-4 text-gray-400 text-sm">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-3">
                        <Link
                          href={`/posts/${post._id}`}
                          className="text-sm text-blue-400 hover:text-blue-300"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(post._id, post.title)}
                          disabled={deleting === post._id}
                          className="text-sm text-red-400 hover:text-red-300 disabled:opacity-50"
                        >
                          {deleting === post._id ? "..." : "Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
