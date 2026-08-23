"use client";

import { useEffect, useState } from "react";
import { X, ImagePlus, Loader2, Send } from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
};

export default function CreateStoryModal({ open, onClose, onCreated }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  const reset = () => {
    setFile(null);
    setPreview(null);
    setCaption("");
    setError("");
    setLoading(false);
  };

  const handleClose = () => {
    if (loading) return;

    reset();
    onClose();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) return;

    setError("");

    if (
      !selectedFile.type.startsWith("image/") &&
      !selectedFile.type.startsWith("video/")
    ) {
      setError("Please select an image or video.");
      return;
    }

    if (selectedFile.size > 50 * 1024 * 1024) {
      setError("File size must be less than 50 MB.");
      return;
    }

    setFile(selectedFile);
  };

  const handleCreateStory = async () => {
    if (!file) {
      setError("Please select an image or video.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      /* =====================================================
       STEP 1: Upload to Cloudinary
       ===================================================== */

      const formData = new FormData();

      formData.append("file", file);

      const uploadResponse = await fetch("/api/stories/upload", {
        method: "POST",
        body: formData,
      });

      const uploadText = await uploadResponse.text();

      const uploadData = uploadText ? JSON.parse(uploadText) : {};

      if (!uploadResponse.ok) {
        throw new Error(
          uploadData.error || `Upload failed (${uploadResponse.status})`,
        );
      }

      if (!uploadData.mediaUrl) {
        throw new Error("No media URL returned from upload.");
      }

      /* =====================================================
       STEP 2: Create Story record
       ===================================================== */

      const storyResponse = await fetch("/api/stories", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          mediaUrl: uploadData.mediaUrl,

          resourceType: uploadData.resourceType,

          caption: caption.trim() || null,
        }),
      });

      const storyText = await storyResponse.text();

      const storyData = storyText ? JSON.parse(storyText) : {};

      if (!storyResponse.ok) {
        throw new Error(
          storyData.error || `Failed to create story (${storyResponse.status})`,
        );
      }

      console.log("Story created:", storyData);

      /* =====================================================
       SUCCESS
       ===================================================== */

      reset();

      onClose();

      /*
       * Reload GET /api/stories
       */

      onCreated();
    } catch (error) {
      console.error("Create story error:", error);

      setError(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      {/* Modal */}
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
          <h2 className="text-lg font-semibold text-gray-900">Create Story</h2>

          <button
            onClick={handleClose}
            disabled={loading}
            className="rounded-full p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 disabled:cursor-not-allowed"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-5">
          {!preview ? (
            /* Upload Area */
            <label className="flex h-80 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 transition hover:border-gray-400 hover:bg-gray-100">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-200">
                <ImagePlus size={32} className="text-gray-500" />
              </div>

              <p className="text-sm font-semibold text-gray-800">
                Add to your story
              </p>

              <p className="mt-1 text-xs text-gray-500">
                Upload an image or video
              </p>

              <p className="mt-2 text-[11px] text-gray-400">
                Maximum size: 50 MB
              </p>

              <input
                type="file"
                accept="image/*,video/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          ) : (
            /* Preview */
            <div className="relative h-[500px] overflow-hidden rounded-2xl bg-gray-100">
              {file?.type.startsWith("video/") ? (
                <video
                  src={preview}
                  controls
                  className="h-full w-full object-contain"
                />
              ) : (
                <img
                  src={preview}
                  alt="Story preview"
                  className="h-full w-full object-contain"
                />
              )}

              {/* Change media */}
              {!loading && (
                <label className="absolute bottom-4 left-4 cursor-pointer rounded-full bg-white px-4 py-2 text-sm font-medium text-gray-800 shadow-lg transition hover:bg-gray-100">
                  Change
                  <input
                    type="file"
                    accept="image/*,video/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          )}

          {/* Caption */}
          {preview && (
            <div className="mt-4">
              <input
                type="text"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Add a caption..."
                maxLength={150}
                disabled={loading}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none placeholder:text-gray-400 transition focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
              />
            </div>
          )}

          {/* Error */}
          {error && (
            <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-500">
              {error}
            </p>
          )}

          {/* Share Button */}
          {preview && (
            <button
              onClick={handleCreateStory}
              disabled={loading}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Posting...
                </>
              ) : (
                <>
                  <Send size={18} />
                  Share to Story
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
