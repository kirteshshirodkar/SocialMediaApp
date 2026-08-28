"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, X } from "lucide-react";

import ExplorePostGrid from "./ExplorePostGrid";
import UserSearch from "./UserSearch";

import FeedPost from "../homePageComponents/PostCard/FeedPost";
import type { PostType } from "../homePageComponents/types";

export default function ExplorePage() {
  const [posts, setPosts] = useState<PostType[]>([]);

  const [selectedPostIndex, setSelectedPostIndex] =
    useState<number | null>(null);

  const [loading, setLoading] = useState(true);

  const modalScrollRef = useRef<HTMLDivElement | null>(null);

  /* ===============================
     FETCH EXPLORE POSTS
     =============================== */

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("/api/explore");

        if (!response.ok) {
          throw new Error(
            "Failed to fetch explore posts"
          );
        }

        const data = await response.json();

        setPosts(data);
      } catch (error) {
        console.error(
          "Explore fetch error:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  /* ===============================
     CLOSE MODAL WITH ESC
     =============================== */

  useEffect(() => {
    if (selectedPostIndex === null) return;

    const handleEscape = (
      event: KeyboardEvent
    ) => {
      if (event.key === "Escape") {
        setSelectedPostIndex(null);
      }
    };

    document.addEventListener(
      "keydown",
      handleEscape
    );

    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener(
        "keydown",
        handleEscape
      );

      document.body.style.overflow = "";
    };
  }, [selectedPostIndex]);

  /* ===============================
     SCROLL TO CLICKED POST
     =============================== */

  useEffect(() => {
    if (selectedPostIndex === null) return;

    const container = modalScrollRef.current;

    if (!container) return;

    const selectedElement =
      container.querySelector(
        `[data-post-index="${selectedPostIndex}"]`
      );

    selectedElement?.scrollIntoView({
      block: "start",
    });
  }, [selectedPostIndex]);

  return (
    <>
      <div className="w-full max-w-5xl mx-auto px-3 md:px-6 py-6">

        {/* USER SEARCH */}

        <div className="mb-8">
          <UserSearch />
        </div>

        {/* PAGE HEADER */}

        <div className="mb-5">
          <h1 className="text-2xl font-bold">
            Explore
          </h1>

          <p className="text-sm text-gray-500">
            Discover posts from people in the community
          </p>
        </div>

        {/* LOADING */}

        {loading && (
          <div className="flex items-center justify-center py-24">
            <Loader2
              size={30}
              className="animate-spin"
            />
          </div>
        )}

        {/* EMPTY */}

        {!loading &&
          posts.length === 0 && (
            <div className="text-center text-gray-500 py-24">
              No posts available yet.
            </div>
          )}

        {/* GRID */}

        {!loading &&
          posts.length > 0 && (
            <ExplorePostGrid
              posts={posts}
              onPostClick={(post) => {
                const index = posts.findIndex(
                  (item) => item.id === post.id
                );

                if (index !== -1) {
                  setSelectedPostIndex(index);
                }
              }}
            />
          )}
      </div>

      {/* =====================================
          SCROLLABLE EXPLORE MODAL
          ===================================== */}

      {selectedPostIndex !== null && (
        <div
          className="
            fixed
            inset-0
            z-[100]
            bg-black/80
          "
        >
          {/* CLOSE BUTTON */}

          <button
            onClick={() =>
              setSelectedPostIndex(null)
            }
            className="
              fixed
              top-5
              right-5
              z-[120]
              text-white
              bg-black/40
              hover:bg-black/60
              rounded-full
              p-2
              transition
            "
            aria-label="Close posts"
          >
            <X size={28} />
          </button>

          {/* SCROLL AREA */}

          <div
            ref={modalScrollRef}
            className="
              h-screen
              overflow-y-auto
              px-3
              md:px-6
              py-8
            "
          >
            <div className="w-full max-w-xl mx-auto space-y-8">

              {posts.map((post, index) => (
                <div
                  key={post.id}
                  data-post-index={index}
                  className="scroll-mt-8"
                >
                  <FeedPost post={post} />
                </div>
              ))}

            </div>
          </div>
        </div>
      )}
    </>
  );
}