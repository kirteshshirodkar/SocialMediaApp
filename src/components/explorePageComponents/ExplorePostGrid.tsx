"use client";

import Image from "next/image";
import { Heart, MessageCircle } from "lucide-react";
import type { PostType } from "../homePageComponents/types";

type Props = {
  posts: PostType[];
  onPostClick: (post: PostType) => void;
};

export default function ExplorePostGrid({
  posts,
  onPostClick,
}: Props) {
  return (
    <div className="grid grid-cols-3 gap-1 md:gap-2">
      {posts.map((post) => (
        <button
          key={post.id}
          onClick={() => onPostClick(post)}
          className="
            relative
            aspect-square
            overflow-hidden
            bg-gray-200
            group
          "
        >
          {post.imageUrl && (
            <Image
              src={post.imageUrl}
              alt={post.caption || "Post"}
              fill
              sizes="
                (max-width: 768px) 33vw,
                300px
              "
              className="
                object-cover
                transition-transform
                duration-300
                group-hover:scale-105
              "
            />
          )}

          {/* Hover overlay */}

          <div
            className="
              absolute
              inset-0
              bg-black/40
              opacity-0
              group-hover:opacity-100
              transition
              flex
              items-center
              justify-center
              gap-6
              text-white
            "
          >
            <div className="flex items-center gap-2 font-semibold">
              <Heart
                size={22}
                fill="white"
              />

              {post._count.likes}
            </div>

            <div className="flex items-center gap-2 font-semibold">
              <MessageCircle
                size={22}
                fill="white"
              />

              {post._count.comments}
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}