"use client";

import { Smile } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";

export default function CommentInput() {
  const [comment, setComment] = useState("");
  const [showPicker, setShowPicker] = useState(false);

  const pickerRef = useRef<HTMLDivElement>(null);

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

    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    setComment((prev) => prev + emojiData.emoji);
  };

  return (
    <div className="relative border-t px-4 py-3 flex items-center gap-3">

      {/* Emoji Button */}
      <div className="relative" ref={pickerRef}>
        <button
          onClick={() => setShowPicker(!showPicker)}
          type="button"
        >
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
        placeholder="Add a comment..."
        className="flex-1 outline-none text-sm"
      />

      {/* Post */}
      <button
        disabled={!comment.trim()}
        className={`font-semibold text-sm transition ${
          comment.trim()
            ? "text-blue-500 hover:text-blue-600"
            : "text-blue-300 cursor-not-allowed"
        }`}
      >
        Post
      </button>
    </div>
  );
}