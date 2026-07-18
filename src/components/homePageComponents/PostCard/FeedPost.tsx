"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  MoreHorizontal,
} from "lucide-react";
import { useState } from "react";
import { PostType } from "./types";

export default function FeedPost({
  post,
}: {
  post: PostType;
}) {
  const [liked, setLiked] = useState(false);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      {/* ================= HEADER ================= */}
      <div className="flex items-center justify-between px-4 py-3">
        <Link
          href={`/profile/${post.user.username}`}
          className="flex items-center gap-3"
        >
          {post.user.imageUrl ? (
            <div className="relative w-10 h-10">
              <Image
                src={post.user.imageUrl}
                alt={post.user.username}
                fill
                sizes="40px"
                className="rounded-full object-cover"
              />
            </div>
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-200" />
          )}

          <div>
            <p className="font-semibold text-sm">{post.user.username}</p>
            <p className="text-xs text-gray-500">Suggested for you</p>
          </div>
        </Link>

        <button className="text-gray-500 hover:text-black transition">
          <MoreHorizontal size={20} />
        </button>
      </div>

      {/* ================= IMAGE ================= */}
      <div className="relative aspect-square w-full bg-gray-100">
        {post.imageUrl && (
          <Image
            src={post.imageUrl}
            alt={post.caption || "Post image"}
            fill
            sizes="(max-width:768px) 100vw, 600px"
            className="object-cover"
          />
        )}
      </div>

      {/* ================= ACTIONS ================= */}
      <div className="px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-5">
            <button
              onClick={() => setLiked(!liked)}
              className="transition hover:scale-110"
            >
              <Heart
                size={26}
                className={`transition-all duration-200 ${
                  liked ? "fill-red-500 text-red-500" : "text-gray-800"
                }`}
              />
            </button>

            <button className="hover:scale-110 transition">
              <MessageCircle size={25} className="text-gray-800" />
            </button>

            <button className="hover:scale-110 transition">
              <Share2 size={24} className="text-gray-800" />
            </button>
          </div>

          <button className="hover:scale-110 transition">
            <Bookmark size={24} className="text-gray-800" />
          </button>
        </div>

        {/* Likes Count */}
        <p className="font-semibold text-sm mt-3">245 likes</p>

        {/* Caption */}
        <div className="mt-2 text-sm">
          <span className="font-semibold mr-2">
            {post.user.username}
          </span>

          <span className="text-gray-800">
            {post.caption}
          </span>
        </div>

        {/* View Comments */}
        <button className="text-gray-500 text-sm mt-2 hover:text-gray-700">
          View all 18 comments
        </button>

        {/* Time */}
        <p className="text-xs uppercase tracking-wide text-gray-400 mt-3">
          {new Intl.DateTimeFormat("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          }).format(new Date(post.createdAt))}
        </p>
      </div>
    </div>
  );
}