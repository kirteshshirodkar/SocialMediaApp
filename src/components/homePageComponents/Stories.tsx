"use client";

import { useCallback, useEffect, useState } from "react";
import { X, User, Plus, Loader2, Trash2 } from "lucide-react";

import CreateStoryModal from "./CreateStoryModal";
import type { Story } from "./types";

/* =========================================================
   MAIN COMPONENT
   ========================================================= */

export default function Stories() {
  const [stories, setStories] = useState<Story[]>([]);

  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);

  const [createStoryOpen, setCreateStoryOpen] = useState(false);

  const [activeUserStories, setActiveUserStories] = useState<Story | null>(
    null,
  );

  /* =========================================================
     FETCH STORIES
     ========================================================= */

  const fetchStories = useCallback(async () => {
    try {
      const response = await fetch("/api/stories", {
        method: "GET",
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch stories");
      }

      setCurrentUserId(data.currentUserId);

      /*
       * The API already puts the current user first.
       * We sort again here as a safety measure.
       */

      const sortedStories = [...(data.stories || [])].sort(
        (a: Story, b: Story) => {
          if (a.isOwnStory) return -1;
          if (b.isOwnStory) return 1;

          return 0;
        },
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
    const isOwnStory = story.user.id === currentUserId;

    const hasStories = story.stories.length > 0;

    /*
     * Current user has no story.
     *
     * Clicking "Your Story" opens Create Story.
     */

    if (isOwnStory && !hasStories) {
      setCreateStoryOpen(true);
      return;
    }

    /*
     * User has at least one story.
     *
     * This works for both:
     *
     * - Current user's story
     * - Other users' stories
     */

    setActiveUserStories(story);
  };

  /* =========================================================
     CREATE STORY
     * ========================================================= */

  const handleCreateStory = () => {
    setCreateStoryOpen(true);
  };

  /* =========================================================
     STORY CREATED
     * ========================================================= */

  const handleStoryCreated = async () => {
    /*
     * Reload stories from database.
     */

    await fetchStories();
  };

  /* =========================================================
     LOADING
     ========================================================= */

  if (loading) {
    return (
      <div className="w-full rounded-2xl bg-white/10 px-3 py-4 shadow-lg backdrop-blur-md">
        <div className="flex gap-6 overflow-x-auto px-1 scrollbar-hide">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="flex min-w-[64px] flex-col items-center">
              <div className="h-16 w-16 animate-pulse rounded-full bg-white/20" />

              <div className="mt-2 h-3 w-12 animate-pulse rounded bg-white/20" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const handleAddStoryFromViewer = () => {
    /*
     * Close the current story viewer.
     */
    setActiveUserStories(null);

    /*
     * Open Create Story modal.
     */
    setCreateStoryOpen(true);
  };

  const handleStoryDeleted = async () => {
    /*
     * Close the story viewer.
     */
    setActiveUserStories(null);

    /*
     * Refresh the stories row.
     */
    await fetchStories();
  };

  /* =========================================================
     MAIN UI
     ========================================================= */

  return (
    <>
      <div className="w-full rounded-2xl bg-white/10 px-3 py-4 shadow-lg backdrop-blur-md">
        <div className="flex snap-x snap-mandatory gap-6 overflow-x-auto px-1 scrollbar-hide">
          {stories.map((story) => (
            <StoryItem
              key={story.user.id}
              story={story}
              isOwnStory={story.user.id === currentUserId}
              onClick={() => handleStoryClick(story)}
              onCreateStory={handleCreateStory}
            />
          ))}
        </div>
      </div>

      {/* =====================================================
          CREATE STORY MODAL
          ===================================================== */}

      <CreateStoryModal
        open={createStoryOpen}
        onClose={() => setCreateStoryOpen(false)}
        onCreated={handleStoryCreated}
      />

      {/* =====================================================
          STORY VIEWER
          ===================================================== */}

      {activeUserStories && (
        <StoryModal
          story={activeUserStories}
          onClose={() => setActiveUserStories(null)}
          onViewed={fetchStories}
          onAddStory={handleAddStoryFromViewer}
          onDeleted={handleStoryDeleted}
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
  onCreateStory: () => void;
};

function StoryItem({
  story,
  isOwnStory,
  onClick,
  onCreateStory,
}: StoryItemProps) {
  const hasStories = story.stories.length > 0;

  return (
    <div className="group flex min-w-[64px] snap-start flex-col items-center">
      {/* =====================================================
          AVATAR
          ===================================================== */}

      <div
        onClick={onClick}
        role="button"
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            onClick();
          }
        }}
        className="cursor-pointer transition-all duration-300 group-hover:scale-105"
      >
        <div
          className={`
            relative h-16 w-16 rounded-full p-[2px]
            ${
              isOwnStory
                ? hasStories
                  ? "bg-gradient-to-tr from-pink-500 via-orange-400 to-yellow-400"
                  : "bg-gray-300"
                : story.isSeen
                  ? "bg-gray-400"
                  : "bg-gradient-to-tr from-pink-500 via-orange-400 to-yellow-400"
            }
          `}
        >
          {/* =================================================
              WHITE INNER RING
              ================================================= */}

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
              CREATE STORY BUTTON
              ================================================= */}

          {isOwnStory && (
            <button
              type="button"
              onClick={(event) => {
                /*
                 * Prevent avatar click.
                 */

                event.stopPropagation();

                onCreateStory();
              }}
              className="absolute bottom-0 right-0 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-blue-500 text-white shadow-md transition hover:scale-110 hover:bg-blue-600"
              aria-label="Create story"
            >
              <Plus size={12} strokeWidth={3} />
            </button>
          )}
        </div>
      </div>

      {/* =====================================================
          USERNAME
          ===================================================== */}

      <p className="mt-2 max-w-[70px] truncate text-center text-xs text-black/80">
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

  onAddStory: () => void;
  onDeleted: () => void;
};

function StoryModal({
  story,
  onClose,
  onViewed,
  onAddStory,
  onDeleted,
}: StoryModalProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const [viewing, setViewing] = useState(false);

  const [deleting, setDeleting] = useState(false);

  const [deleteError, setDeleteError] = useState("");

  const currentStory = story.stories[currentIndex];

  /* =======================================================
     MARK STORY AS VIEWED
     ======================================================= */

  useEffect(() => {
    if (!currentStory) return;

    /*
     * Don't create a view record for
     * the current user's own story.
     */

    if (story.isOwnStory) {
      return;
    }

    const markAsViewed = async () => {
      try {
        setViewing(true);

        const response = await fetch(`/api/stories/${currentStory.id}/view`, {
          method: "POST",
        });

        if (!response.ok) {
          console.error("Failed to mark story as viewed");

          return;
        }

        /*
         * Refresh story bubbles so the
         * seen/unseen ring updates.
         */

        onViewed();
      } catch (error) {
        console.error("Failed to mark story as viewed:", error);
      } finally {
        setViewing(false);
      }
    };

    markAsViewed();
  }, [currentStory, story.isOwnStory, onViewed]);

  /* =======================================================
     NEXT STORY
     ======================================================= */

  const handleNext = () => {
    if (currentIndex < story.stories.length - 1) {
      setCurrentIndex((previous) => previous + 1);
    } else {
      onClose();
    }
  };

  /* =======================================================
     PREVIOUS STORY
     ======================================================= */

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((previous) => previous - 1);
    }
  };

  if (!currentStory) {
    return null;
  }

  const handleDeleteStory = async () => {
    /*
     * Extra frontend protection.
     */
    if (!story.isOwnStory) {
      return;
    }

    if (!currentStory) {
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this story?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeleting(true);
      setDeleteError("");

      const response = await fetch(`/api/stories/${currentStory.id}`, {
        method: "DELETE",
      });

      const responseText = await response.text();

      const data = responseText ? JSON.parse(responseText) : {};

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete story");
      }

      /*
       * Tell parent component that deletion
       * was successful.
       */
      await onDeleted();
    } catch (error) {
      console.error("Delete story error:", error);

      setDeleteError(
        error instanceof Error ? error.message : "Failed to delete story",
      );
    } finally {
      setDeleting(false);
    }
  };

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
                  index <= currentIndex ? "w-full bg-white" : "w-0"
                }`}
              />
            </div>
          ))}
        </div>

        {/* =================================================
            HEADER
            ================================================= */}

        <div className="absolute left-0 right-0 top-0 z-30 flex items-center justify-between px-4 pt-7">
          {/* =============================
      USER
      ============================= */}

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
              {story.isOwnStory ? "Your Story" : story.user.username}
            </span>
          </div>

          {/* =============================
      ACTIONS
      ============================= */}

          <div className="flex items-center gap-1">
            {/* Only owner can see these controls */}

            {story.isOwnStory && (
              <>
                {/* ADD STORY */}

                <button
                  type="button"
                  onClick={onAddStory}
                  disabled={deleting}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition hover:bg-white/20 disabled:opacity-50"
                  aria-label="Add story"
                  title="Add story"
                >
                  <Plus size={20} />
                </button>

                {/* DELETE CURRENT STORY */}

                <button
                  type="button"
                  onClick={handleDeleteStory}
                  disabled={deleting}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition hover:bg-red-500/80 disabled:cursor-not-allowed disabled:opacity-50"
                  aria-label="Delete story"
                  title="Delete story"
                >
                  {deleting ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <Trash2 size={18} />
                  )}
                </button>
              </>
            )}

            {/* CLOSE */}

            <button
              type="button"
              onClick={onClose}
              disabled={deleting}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition hover:bg-white/20 disabled:opacity-50"
              aria-label="Close story"
            >
              <X size={22} />
            </button>
          </div>
        </div>

        {/* =================================================
            STORY CONTENT
            ================================================= */}

        {currentStory.resourceType === "video" ? (
          <video
            key={currentStory.id}
            src={currentStory.mediaUrl}
            autoPlay
            controls
            playsInline
            className="h-full w-full object-contain"
          />
        ) : (
          <img
            key={currentStory.id}
            src={currentStory.mediaUrl}
            alt={
              story.isOwnStory ? "Your story" : `${story.user.username}'s story`
            }
            className="h-full w-full object-contain"
          />
        )}

        {deleteError && (
          <div className="absolute bottom-20 left-4 right-4 z-30">
            <div className="rounded-xl bg-red-500/90 px-4 py-3 text-center text-sm text-white shadow-lg backdrop-blur-md">
              {deleteError}
            </div>
          </div>
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
          type="button"
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          className="absolute left-0 top-1/2 z-10 h-1/2 w-1/3 -translate-y-1/2 cursor-pointer disabled:cursor-default"
          aria-label="Previous story"
        />

        {/* =================================================
            NEXT AREA
            ================================================= */}

        <button
          type="button"
          onClick={handleNext}
          className="absolute right-0 top-1/2 z-10 h-1/2 w-2/3 -translate-y-1/2 cursor-pointer"
          aria-label="Next story"
        />

        {/* =================================================
            VIEW LOADING
            ================================================= */}

        {viewing && (
          <div className="absolute bottom-4 right-4 z-20">
            <Loader2 size={16} className="animate-spin text-white/70" />
          </div>
        )}
      </div>
    </div>
  );
}
