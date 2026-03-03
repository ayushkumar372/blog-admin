"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import AdminLayout from "@/components/AdminLayout";
import TiptapEditor from "@/components/TiptapEditor";
import { api } from "@/lib/api";
import { openCloudinaryWidget } from "@/lib/cloudinary";

interface Post {
  _id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  coverImage: string;
  tags: string[];
  status: "draft" | "published";
}

export default function EditPostPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [post, setPost] = useState<Post | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("<p></p>");
  const [excerpt, setExcerpt] = useState("");
  const [tags, setTags] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch post by ID — we get slug from getAllPosts and match
    api.getAllPosts().then((posts: Post[]) => {
      const found = posts.find((p) => p._id === id);
      if (found) {
        // Fetch full post content by slug
        api.getPost(found.slug).then((fullPost: Post) => {
          setPost(fullPost);
          setTitle(fullPost.title);
          setContent(fullPost.content);
          setExcerpt(fullPost.excerpt || "");
          setCoverImage(fullPost.coverImage || "");
          setTags((fullPost.tags || []).join(", "));
        });
      }
      setLoading(false);
    });
  }, [id]);

  const handleSave = async (publishStatus: "draft" | "published") => {
    if (!title.trim()) return setError("Title is required");
    setError("");
    setSaving(true);
    try {
      await api.updatePost(id, {
        title,
        content,
        excerpt,
        coverImage,
        tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
        status: publishStatus,
      });
      router.push("/posts");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-8 text-gray-500">Loading post...</div>
      </AdminLayout>
    );
  }

  if (!post) {
    return (
      <AdminLayout>
        <div className="p-8 text-red-400">Post not found</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-8 max-w-5xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-white">Edit Post</h1>
          <div className="flex gap-3">
            <button
              onClick={() => handleSave("draft")}
              disabled={saving}
              className="px-5 py-2.5 rounded-lg text-sm font-semibold border border-gray-700 text-gray-300 hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              Save Draft
            </button>
            <button
              onClick={() => handleSave("published")}
              disabled={saving}
              className="px-5 py-2.5 rounded-lg text-sm font-semibold bg-green-600 hover:bg-green-500 text-white transition-colors disabled:opacity-50"
            >
              {saving ? "Saving..." : "Update & Publish"}
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 text-red-400 text-sm bg-red-400/10 px-4 py-2 rounded-lg">
            {error}
          </div>
        )}

        <div className="space-y-5">
          <input
            type="text"
            placeholder="Post title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-gray-900 border border-gray-700 text-white text-2xl font-bold rounded-xl px-5 py-4 focus:outline-none focus:border-blue-500 placeholder:text-gray-600"
          />

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Cover image URL (optional)"
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              className="flex-1 bg-gray-900 border border-gray-700 text-white rounded-xl px-5 py-3 text-sm focus:outline-none focus:border-blue-500 placeholder:text-gray-600"
            />
            <button
              type="button"
              onClick={() => openCloudinaryWidget((url) => setCoverImage(url))}
              className="px-4 py-3 rounded-xl text-sm font-medium bg-blue-600 hover:bg-blue-500 text-white transition-colors whitespace-nowrap"
            >
              Upload Image
            </button>
          </div>
          {coverImage && (
            <img
              src={coverImage}
              alt="Cover preview"
              className="h-40 w-full object-cover rounded-xl border border-gray-700"
            />
          )}

          <TiptapEditor content={content} onChange={setContent} />

          <textarea
            placeholder="Excerpt (auto-generated if empty)"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            rows={3}
            className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl px-5 py-3 text-sm focus:outline-none focus:border-blue-500 placeholder:text-gray-600 resize-none"
          />

          <input
            type="text"
            placeholder="Tags (comma separated)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl px-5 py-3 text-sm focus:outline-none focus:border-blue-500 placeholder:text-gray-600"
          />
        </div>
      </div>
    </AdminLayout>
  );
}
