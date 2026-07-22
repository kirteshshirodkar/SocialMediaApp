"use client";

import { Smile } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import { CommentInputProps } from "./types";
import { useRouter } from "next/navigation";

export default function CommentInput({ postId }: CommentInputProps) {
  const [comment, setComment] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Close picker when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target as Node)
      ) {
        setShowPicker(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    setComment((prev) => prev + emojiData.emoji);
  };

  const handleSubmit = async () => {
    if (!comment.trim()) return;

    try {
      setLoading(true);

      const response = await fetch("/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postId,
          content: comment,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create comment");
      }

      setComment("");
      setShowPicker(false);

      router.refresh();
    } catch (error) {
      console.error("Error creating comment:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative border-t px-4 py-3 flex items-center gap-3">
      {/* Emoji Button */}
      <div className="relative" ref={pickerRef}>
        <button onClick={() => setShowPicker(!showPicker)} type="button">
          <Smile
            size={22}
            className="text-gray-500 hover:text-black transition"
          />
        </button>

        {showPicker && (
          <div className="absolute bottom-12 left-0 z-50">
            <EmojiPicker
              onEmojiClick={handleEmojiClick}
              height={350}
              width={300}
            />
          </div>
        )}
      </div>

      {/* Input */}
      <input
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !loading) {
            e.preventDefault();
            handleSubmit();
          }
        }}
        placeholder="Add a comment..."
        className="flex-1 outline-none text-sm"
      />

      <button
        onClick={handleSubmit}
        disabled={!comment.trim() || loading}
        className={`font-semibold text-sm transition ${
          comment.trim()
            ? "text-blue-500 hover:text-blue-600"
            : "text-blue-300 cursor-not-allowed"
        }`}
      >
       {loading ? "Posting..." : "Post"}
      </button>
    </div>
  );
}
