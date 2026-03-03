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

export default function Dashboard() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getAllPosts()
      .then(setPosts)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const published = posts.filter((p) => p.status === "published").length;
  const drafts = posts.filter((p) => p.status === "draft").length;
  const totalViews = posts.reduce((sum, p) => sum + (p.views || 0), 0);

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <Link
            href="/posts/new"
            className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors"
          >
            + New Post
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: "Total Posts", value: posts.length, color: "blue" },
            { label: "Published", value: published, color: "green" },
            { label: "Drafts", value: drafts, color: "yellow" },
          ].map((stat) => (
            <div key={stat.label} className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <p className="text-gray-400 text-sm">{stat.label}</p>
              <p className="text-3xl font-bold text-white mt-1">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Recent Posts */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl">
          <div className="p-6 border-b border-gray-800">
            <h2 className="text-lg font-semibold text-white">Recent Posts</h2>
          </div>
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading...</div>
          ) : posts.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No posts yet.{" "}
              <Link href="/posts/new" className="text-blue-400 hover:underline">
                Create your first post
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-800">
              {posts.slice(0, 5).map((post) => (
                <div
                  key={post._id}
                  className="px-6 py-4 flex items-center justify-between"
                >
                  <div>
                    <p className="text-white font-medium">{post.title}</p>
                    <p className="text-gray-500 text-sm mt-0.5">
                      {new Date(post.createdAt).toLocaleDateString()} ·{" "}
                      {post.views} views
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                        post.status === "published"
                          ? "bg-green-400/10 text-green-400"
                          : "bg-yellow-400/10 text-yellow-400"
                      }`}
                    >
                      {post.status}
                    </span>
                    <Link
                      href={`/posts/${post._id}`}
                      className="text-sm text-blue-400 hover:text-blue-300"
                    >
                      Edit
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
