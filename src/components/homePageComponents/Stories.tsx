"use client";

import { useCallback, useEffect, useState } from "react";
import { X, User, Plus, Loader2 } from "lucide-react";
import CreateStoryModal from "./CreateStoryModal";

/* =========================================================
   TYPES
   ========================================================= */

export type StoryItem = {
  id: string;
  mediaUrl: string;
  caption: string | null;
  createdAt: string;
  expiresAt: string;
};

export type Story = {
  user: {
    id: string;
    username: string;
    imageUrl: string | null;
  };

  stories: StoryItem[];

  isSeen: boolean;
};

/* =========================================================
   MAIN COMPONENT
   ========================================================= */

export default function Stories() {
  const [stories, setStories] = useState<Story[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(
    null
  );

  const [loading, setLoading] = useState(true);

  const [createStoryOpen, setCreateStoryOpen] = useState(false);

  const [activeUserStories, setActiveUserStories] =
    useState<Story | null>(null);

  /* =========================================================
     FETCH STORIES
     ========================================================= */

  const fetchStories = useCallback(async () => {
    try {
      setLoading(true);

      const response = await fetch("/api/stories", {
        method: "GET",
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to fetch stories"
        );
      }

      setCurrentUserId(data.currentUserId);

      /*
       * Make sure current user's story is always first.
       */

      const sortedStories = [...(data.stories || [])].sort(
        (a: Story, b: Story) => {
          if (a.user.id === data.currentUserId) return -1;

          if (b.user.id === data.currentUserId) return 1;

          return 0;
        }
      );

      setStories(sortedStories);
    } catch (error) {
      console.error("Failed to fetch stories:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  /* =========================================================
     INITIAL LOAD
     ========================================================= */

  useEffect(() => {
    fetchStories();
  }, [fetchStories]);

  /* =========================================================
     STORY CLICK
     ========================================================= */

  const handleStoryClick = (story: Story) => {
    /*
     * Current user's story:
     * Open Create Story modal.
     */

    if (story.user.id === currentUserId) {
      setCreateStoryOpen(true);
      return;
    }

    /*
     * Other user's story:
     * Open story viewer.
     */

    setActiveUserStories(story);
  };

  /* =========================================================
     LOADING
     ========================================================= */

  if (loading) {
    return (
      <div className="w-full rounded-2xl bg-white/10 px-3 py-4 backdrop-blur-md shadow-lg">
        <div className="flex gap-6 overflow-x-auto px-1 scrollbar-hide">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="flex min-w-[64px] flex-col items-center"
            >
              <div className="h-16 w-16 animate-pulse rounded-full bg-white/20" />

              <div className="mt-2 h-3 w-12 animate-pulse rounded bg-white/20" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  /* =========================================================
     MAIN UI
     ========================================================= */

  return (
    <>
      <div className="w-full rounded-2xl bg-white/10 px-3 py-4 backdrop-blur-md shadow-lg">
        <div className="flex gap-6 overflow-x-auto px-1 snap-x snap-mandatory scrollbar-hide">

          {stories.map((story) => (
            <StoryItem
              key={story.user.id}
              story={story}
              isOwnStory={story.user.id === currentUserId}
              onClick={() => handleStoryClick(story)}
            />
          ))}

          {/* Empty state */}
          {stories.length === 0 && (
            <button
              onClick={() => setCreateStoryOpen(true)}
              className="flex min-w-[80px] flex-col items-center"
            >
              <div className="relative flex h-16 w-16 items-center justify-center rounded-full border-2 border-dashed border-gray-300 bg-white">
                <Plus className="h-7 w-7 text-gray-500" />
              </div>

              <p className="mt-2 max-w-[70px] truncate text-center text-xs text-white/80">
                Your Story
              </p>
            </button>
          )}
        </div>
      </div>

      {/* =====================================================
          CREATE STORY MODAL
          ===================================================== */}

      <CreateStoryModal
        open={createStoryOpen}
        onClose={() => setCreateStoryOpen(false)}
        onCreated={() => {
          /*
           * Immediately reload stories after
           * creating a new story.
           */

          fetchStories();
        }}
      />

      {/* =====================================================
          STORY VIEWER
          ===================================================== */}

      {activeUserStories && (
        <StoryModal
          story={activeUserStories}
          onClose={() => setActiveUserStories(null)}
          onViewed={fetchStories}
        />
      )}

      {/* =====================================================
          SCROLLBAR
          ===================================================== */}

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }

        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </>
  );
}

/* =========================================================
   STORY ITEM
   ========================================================= */

type StoryItemProps = {
  story: Story;
  isOwnStory: boolean;
  onClick: () => void;
};

function StoryItem({
  story,
  isOwnStory,
  onClick,
}: StoryItemProps) {
  return (
    <div
      onClick={onClick}
      className="group flex min-w-[64px] cursor-pointer snap-start flex-col items-center transition-all duration-300"
    >
      {/* =====================================================
          AVATAR + RING
          ===================================================== */}

      <div
        className={`
          relative h-16 w-16 rounded-full p-[2px]
          transition-all duration-300
          group-hover:scale-105
          ${
            isOwnStory
              ? "bg-gray-300"
              : story.isSeen
                ? "bg-gray-400"
                : "bg-gradient-to-tr from-pink-500 via-orange-400 to-yellow-400"
          }
        `}
      >
        {/* White border around profile image */}
        <div className="h-full w-full rounded-full bg-white p-[2px]">
          {story.user.imageUrl ? (
            <img
              src={story.user.imageUrl}
              alt={story.user.username}
              className="h-full w-full rounded-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center rounded-full bg-gray-100">
              <User className="h-7 w-7 text-gray-400" />
            </div>
          )}
        </div>

        {/* =================================================
            PLUS BUTTON FOR CURRENT USER
            ================================================= */}

        {isOwnStory && (
          <div className="absolute bottom-0 right-0 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-blue-500 text-white shadow-md">
            <Plus size={12} strokeWidth={3} />
          </div>
        )}
      </div>

      {/* =====================================================
          USERNAME
          ===================================================== */}

      <p className="mt-2 max-w-[70px] truncate text-center text-xs text-white/80">
        {isOwnStory ? "Your Story" : story.user.username}
      </p>
    </div>
  );
}

/* =========================================================
   STORY MODAL
   ========================================================= */

type StoryModalProps = {
  story: Story;
  onClose: () => void;
  onViewed: () => void;
};

function StoryModal({
  story,
  onClose,
  onViewed,
}: StoryModalProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const [viewing, setViewing] = useState(false);

  const currentStory = story.stories[currentIndex];

  /* =======================================================
     MARK STORY AS SEEN
     ======================================================= */

  useEffect(() => {
    if (!currentStory) return;

    const markAsViewed = async () => {
      try {
        setViewing(true);

        await fetch(
          `/api/stories/${currentStory.id}/view`,
          {
            method: "POST",
          }
        );

        onViewed();
      } catch (error) {
        console.error(
          "Failed to mark story as viewed:",
          error
        );
      } finally {
        setViewing(false);
      }
    };

    markAsViewed();
  }, [currentStory, onViewed]);

  /* =======================================================
     NEXT STORY
     ======================================================= */

  const handleNext = () => {
    if (currentIndex < story.stories.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      onClose();
    }
  };

  /* =======================================================
     PREVIOUS STORY
     ======================================================= */

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  if (!currentStory) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 px-4 backdrop-blur-sm">

      {/* ===================================================
          STORY CONTAINER
          =================================================== */}

      <div className="relative h-[85vh] w-full max-w-md overflow-hidden rounded-2xl bg-black shadow-2xl">

        {/* =================================================
            PROGRESS BARS
            ================================================= */}

        <div className="absolute left-3 right-3 top-3 z-20 flex gap-1">
          {story.stories.map((item, index) => (
            <div
              key={item.id}
              className="h-1 flex-1 overflow-hidden rounded-full bg-white/30"
            >
              <div
                className={`h-full rounded-full transition-all ${
                  index <= currentIndex
                    ? "w-full bg-white"
                    : "w-0"
                }`}
              />
            </div>
          ))}
        </div>

        {/* =================================================
            HEADER
            ================================================= */}

        <div className="absolute left-0 right-0 top-0 z-10 flex items-center justify-between px-4 pt-7">

          <div className="flex items-center gap-3">

            <div className="h-9 w-9 overflow-hidden rounded-full border border-white/30">
              {story.user.imageUrl ? (
                <img
                  src={story.user.imageUrl}
                  alt={story.user.username}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gray-200">
                  <User className="h-5 w-5 text-gray-500" />
                </div>
              )}
            </div>

            <span className="text-sm font-medium text-white">
              {story.user.username}
            </span>
          </div>

          <button
            onClick={onClose}
            className="rounded-full p-2 text-white transition hover:bg-white/10"
          >
            <X size={22} />
          </button>
        </div>

        {/* =================================================
            STORY CONTENT
            ================================================= */}

        {currentStory.mediaUrl.match(
          /\.(mp4|webm|mov|avi|mkv)(\?.*)?$/i
        ) ? (
          <video
            src={currentStory.mediaUrl}
            autoPlay
            controls
            playsInline
            className="h-full w-full object-contain"
          />
        ) : (
          <img
            src={currentStory.mediaUrl}
            alt={`${story.user.username}'s story`}
            className="h-full w-full object-contain"
          />
        )}

        {/* =================================================
            CAPTION
            ================================================= */}

        {currentStory.caption && (
          <div className="absolute bottom-6 left-4 right-4 z-10">
            <div className="rounded-xl bg-black/50 px-4 py-3 text-center text-sm text-white backdrop-blur-md">
              {currentStory.caption}
            </div>
          </div>
        )}

        {/* =================================================
            PREVIOUS AREA
            ================================================= */}

        <button
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          className="absolute left-0 top-1/2 z-10 h-1/2 w-1/3 -translate-y-1/2 cursor-pointer disabled:cursor-default"
          aria-label="Previous story"
        />

        {/* =================================================
            NEXT AREA
            ================================================= */}

        <button
          onClick={handleNext}
          className="absolute right-0 top-1/2 z-10 h-1/2 w-2/3 -translate-y-1/2 cursor-pointer"
          aria-label="Next story"
        />

        {/* Loading indicator */}
        {viewing && (
          <div className="absolute bottom-4 right-4 z-20">
            <Loader2
              size={16}
              className="animate-spin text-white/70"
            />
          </div>
        )}
      </div>
    </div>
  );
}