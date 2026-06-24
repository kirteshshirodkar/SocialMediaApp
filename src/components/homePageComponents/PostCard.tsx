"use client";

import Image from "next/image";
import { Heart, MessageCircle, Share2 } from "lucide-react";
import { useState } from "react";
import image1 from "../../assets/images/pro2.jpg";
import image2 from "../../assets/images/pro6.jpg";
import image3 from "../../assets/images/pro7.jpg";

// 🔥 Reusable Feed Component (Home + Profile Grid)
export default function PostCard({
  variant = "home",
}: {
  variant?: "home" | "profile";
}) {
  const [likedPosts, setLikedPosts] = useState<Record<number, boolean>>({});

  const posts = [
    { id: 1, image: image1, caption: "Exploring clean UI with premium aesthetics ✨", likes: 120, comments: 24 },
    { id: 2, image: image2, caption: "Design systems make everything scalable and elegant.", likes: 98, comments: 12 },
    { id: 3, image: image3, caption: "Minimalism + gradients = modern UI 🔥", likes: 210, comments: 45 },
    { id: 4, image: image1, caption: "Another creative shot", likes: 75, comments: 10 },
    { id: 5, image: image2, caption: "UI inspiration 💡", likes: 140, comments: 30 },
    { id: 6, image: image3, caption: "Clean layouts win", likes: 90, comments: 15 },
  ];

  const toggleLike = (id: number) => {
    setLikedPosts((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // 🔹 PROFILE GRID LAYOUT (Instagram Style)
  if (variant === "profile") {
    return (
      <div className="w-full max-w-5xl mx-auto px-4 mt-6">
        <div className="grid grid-cols-3 gap-4">
          {posts.map((post) => (
            <div
              key={post.id}
              className="relative aspect-square overflow-hidden rounded-xl group cursor-pointer"
            >
              <Image
                src={post.image}
                alt="post"
                fill
                className="object-cover group-hover:scale-105 transition duration-300"
              />

              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-6 text-white">
                <div className="flex items-center gap-1">
                  <Heart size={20} /> {post.likes}
                </div>
                <div className="flex items-center gap-1">
                  <MessageCircle size={20} /> {post.comments}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 🔹 HOME FEED LAYOUT
  return (
    <div className="w-full max-w-2xl mx-auto space-y-8">
      {posts.map((post) => {
        const isLiked = likedPosts[post.id];

        return (
          <div
            key={post.id}
            className="bg-white/80 backdrop-blur-md rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
          >
            {/* Image */}
            <div className="relative w-full h-[320px] md:h-[380px]">
              <Image src={post.image} alt="post" fill className="object-cover" />
            </div>

            {/* Content */}
            <div className="p-5">
              <p className="text-gray-700 text-[15px] font-medium leading-relaxed">
                {post.caption}
              </p>

              <div className="flex items-center justify-between mt-5">
                <div className="flex items-center gap-6">
                  {/* Like */}
                  <button
                    onClick={() => toggleLike(post.id)}
                    className="flex items-center gap-1 group"
                  >
                    <Heart
                      size={22}
                      className={`transition-all duration-200 group-hover:scale-110 ${
                        isLiked ? "text-red-500 fill-red-500" : "text-gray-600"
                      }`}
                    />
                    <span className="text-sm text-gray-600">{post.likes}</span>
                  </button>

                  {/* Comment */}
                  <button className="flex items-center gap-1 group">
                    <MessageCircle
                      size={22}
                      className="text-gray-600 group-hover:text-blue-500 transition-all duration-200 group-hover:scale-110"
                    />
                    <span className="text-sm text-gray-600">{post.comments}</span>
                  </button>

                  {/* Share */}
                  <button className="group">
                    <Share2
                      size={22}
                      className="text-gray-600 group-hover:text-purple-500 transition-all duration-200 group-hover:scale-110"
                    />
                  </button>
                </div>
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
