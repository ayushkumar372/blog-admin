"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import AdminLayout from "@/components/AdminLayout";
import TiptapEditor from "@/components/TiptapEditor";
import { api } from "@/lib/api";

export default function NewPostPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("<p></p>");
  const [excerpt, setExcerpt] = useState("");
  const [tags, setTags] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [status, setStatus] = useState<"draft" | "published">("draft");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async (publishStatus: "draft" | "published") => {
    if (!title.trim()) return setError("Title is required");
    setError("");
    setSaving(true);
    try {
      await api.createPost({
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

  return (
    <AdminLayout>
      <div className="p-8 max-w-5xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-white">New Post</h1>
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
              {saving ? "Publishing..." : "Publish"}
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 text-red-400 text-sm bg-red-400/10 px-4 py-2 rounded-lg">
            {error}
          </div>
        )}

        <div className="space-y-5">
          {/* Title */}
          <input
            type="text"
            placeholder="Post title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-gray-900 border border-gray-700 text-white text-2xl font-bold rounded-xl px-5 py-4 focus:outline-none focus:border-blue-500 placeholder:text-gray-600"
          />

          {/* Cover Image */}
          <input
            type="text"
            placeholder="Cover image URL (optional)"
            value={coverImage}
            onChange={(e) => setCoverImage(e.target.value)}
            className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl px-5 py-3 text-sm focus:outline-none focus:border-blue-500 placeholder:text-gray-600"
          />

          {/* Tiptap Editor */}
          <TiptapEditor content={content} onChange={setContent} />

          {/* Excerpt */}
          <textarea
            placeholder="Excerpt (short description, auto-generated if empty)"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            rows={3}
            className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl px-5 py-3 text-sm focus:outline-none focus:border-blue-500 placeholder:text-gray-600 resize-none"
          />

          {/* Tags */}
          <input
            type="text"
            placeholder="Tags (comma separated: react, nextjs, tutorial)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl px-5 py-3 text-sm focus:outline-none focus:border-blue-500 placeholder:text-gray-600"
          />
        </div>
      </div>
    </AdminLayout>
  );
}
