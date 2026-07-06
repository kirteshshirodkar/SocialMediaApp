"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreatePostForm() {

  const router = useRouter();

  const [caption, setCaption] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    if (!image) return;

    setLoading(true);

    const formData = new FormData();

    formData.append("caption", caption);
    formData.append("image", image);

    const res = await fetch("/api/posts", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      router.push("/");
      router.refresh();
    }

    setLoading(false);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >

      <textarea
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        placeholder="What's on your mind?"
        className="w-full border rounded-lg p-4 h-32"
      />

      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          if (!e.target.files?.length) return;

          const file = e.target.files[0];

          setImage(file);
          setPreview(URL.createObjectURL(file));
        }}
      />

      {preview && (
        <img
          src={preview}
          alt=""
          className="rounded-lg max-h-96"
        />
      )}

      <button
        disabled={loading}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg"
      >
        {loading ? "Uploading..." : "Post"}
      </button>

    </form>
  );
}