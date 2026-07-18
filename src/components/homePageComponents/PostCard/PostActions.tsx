"use client";

import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
} from "lucide-react";
import { useState } from "react";

export default function PostActions() {
  const [liked, setLiked] = useState(false);

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-5">
        <button
          onClick={() => setLiked(!liked)}
          className="hover:scale-110 transition"
        >
          <Heart
            size={26}
            className={
              liked
                ? "fill-red-500 text-red-500"
                : "text-gray-800"
            }
          />
        </button>

        <button className="hover:scale-110 transition">
          <MessageCircle size={25} />
        </button>

        <button className="hover:scale-110 transition">
          <Share2 size={24} />
        </button>
      </div>

      <button className="hover:scale-110 transition">
        <Bookmark size={24} />
      </button>
    </div>
  );
}