"use client";

import Image from "next/image";
import { Heart, MessageCircle, Share2 } from "lucide-react";
import { useState } from "react";
import image1 from "../../assets/images/pro2.jpg";
import image2 from "../../assets/images/pro6.jpg";
import image3 from "../../assets/images/pro7.jpg";
import Link from "next/link";
// 🔥 Reusable Feed Component (Home + Profile Grid)
type PostType = {
  id: string;
  imageUrl: string | null;
  caption: string | null;
  createdAt: Date;

  user: {
    username: string;
    imageUrl: string | null;
  };
};

export default function PostCard({
  posts,
  variant = "home",
}: {
  posts: PostType[];
  variant?: "home" | "profile";
}) {
  // 🔹 PROFILE GRID LAYOUT (Instagram Style)
  if (variant === "profile") {
    return (
      <div className="w-full max-w-5xl mx-auto px-4 mt-6">
        <div className="grid grid-cols-3 gap-4">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/profile/${post.user.username}/posts/${post.id}`}
              className="relative aspect-square overflow-hidden rounded-xl group cursor-pointer"
            >
              {post.imageUrl && (
                <Image
                  src={post.imageUrl}
                  alt="post"
                  fill
                  sizes="(max-width: 768px) 33vw, 300px"
                  className="object-cover group-hover:scale-105 transition duration-300"
                />
              )}

              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition" />
            </Link>
          ))}
        </div>
      </div>
    );
  }

  // 🔹 HOME FEED LAYOUT
  return (
    <div className="w-full max-w-2xl mx-auto space-y-8">
      {posts.map((post) => {
        return (
          <div
            key={post.id}
            className="bg-white/80 backdrop-blur-md rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
          >
            <div className="flex items-center gap-3 p-4">
              {/* username */}
              <div className="flex items-center gap-3 p-4">
                {post.user.imageUrl && (
                  <Image
                    src={post.user.imageUrl}
                    alt={post.user.username}
                    sizes="(max-width: 768px) 100vw, 768px"
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                )}

                <div>
                  <p className="font-semibold">{post.user.username}</p>
                </div>
              </div>
            </div>

            {/* Image */}
            <div className="relative w-full h-[320px] md:h-[380px]">
              {post.imageUrl && (
                <Image
                  src={post.imageUrl}
                  alt={post.caption || "Post image"}
                  fill
                  className="object-cover"
                />
              )}
            </div>

            {/* Content */}
            <div className="p-5">
              <p className="text-gray-700 text-[15px] font-medium leading-relaxed">
                {post.caption ?? ""}
              </p>
              <div className="mt-4 text-sm text-gray-400">
                {new Intl.DateTimeFormat("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                }).format(new Date(post.createdAt))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ✅ USAGE:
// Home Page → <PostFeed variant="home" />
// Profile Page → <PostFeed variant="profile" />
