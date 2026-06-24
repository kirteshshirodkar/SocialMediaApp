"use client";

import { useState } from "react";
import { X, User } from "lucide-react";
import storyImg1 from "../../assets/images/pro6.jpg";
import storyImg2 from "../../assets/images/pro7.jpg";
import storyImg3 from "../../assets/images/pro8.jpg";
import { StaticImageData } from "next/image";
import Image from "next/image";

/* ================= TYPES ================= */

export type Story = {
  id: number;
  name: string;
  image: StaticImageData;
  isSeen: boolean;
  isOwnStory: boolean;
  isActive: boolean;
};

/* ================= DATA ================= */

const storiesData: Story[] = [
  {
    id: 1,
    name: "Your Story",
    image: storyImg1,
    isSeen: false,
    isOwnStory: true,
    isActive: false,
  },
  {
    id: 2,
    name: "Aarav",
    image: storyImg2,
    isSeen: false,
    isOwnStory: false,
    isActive: true,
  },
  {
    id: 3,
    name: "Priya",
    image: storyImg3,
    isSeen: true,
    isOwnStory: false,
    isActive: false,
  },
  {
    id: 4,
    name: "Rahul",
    image: storyImg1,
    isSeen: false,
    isOwnStory: false,
    isActive: false,
  },
];

/* ================= MAIN COMPONENT ================= */

export default function Stories() {
  const [activeStory, setActiveStory] = useState<Story | null>(null);

  return (
    <>
      {/* 🌫️ Glass Container */}
     <div className="w-full px-3 py-4 rounded-2xl backdrop-blur-md bg-white/10 shadow-lg">
        {/* 📐 Stories Row */}
       <div className="flex gap-6 overflow-x-auto scrollbar-hide px-1 snap-x snap-mandatory">
          {storiesData.map((story) => (
            <StoryItem
              key={story.id}
              story={story}
              onClick={() => !story.isOwnStory && setActiveStory(story)}
              
            />
          ))}
        </div>
      </div>

      {/* 🎬 Modal */}
      {activeStory && (
        <StoryModal story={activeStory} onClose={() => setActiveStory(null)} />
      )}

      {/* Scrollbar Hide */}
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

/* ================= STORY ITEM ================= */

type StoryItemProps = {
  story: Story;
  onClick: () => void;
};

function StoryItem({ story, onClick }: StoryItemProps) {
  return (
    <div
      onClick={onClick}
      className="flex flex-col items-center cursor-pointer group transition-all duration-300"
    >
      {/* Avatar + Ring */}
      <div
        className={`
          relative w-16 h-16 rounded-full p-[2px]
          ${
            story.isOwnStory
              ? "bg-white/30"
              : story.isSeen
                ? "bg-gray-400"
                : "bg-gradient-to-tr from-pink-500 via-orange-400 to-yellow-400"
          }
          ${
            story.isActive
              ? "shadow-[0_0_15px_rgba(255,100,200,0.7)]"
              : "shadow-md"
          }
          group-hover:scale-105 group-hover:shadow-xl
          transition-all duration-300
        `}
      >
        {/* 👤 Default Profile Icon */}
        <div className="w-full h-full flex items-center justify-center bg-gray-200 rounded-full">
          <User className="w-8 h-8 text-gray-500" />
        </div>

        {/* ➕ Your Story */}
        {story.isOwnStory && (
          <div className="absolute bottom-0 right-0 bg-blue-500 w-5 h-5 flex items-center justify-center text-white text-xs rounded-full shadow-md">
            +
          </div>
        )}
      </div>

      {/* Username */}
      <p className="text-xs mt-2 text-white/80 max-w-[70px] truncate text-center">
        {story.name}
      </p>
    </div>
  );
}

/* ================= MODAL ================= */

type StoryModalProps = {
  story: Story;
  onClose: () => void;
};

function StoryModal({ story, onClose }: StoryModalProps) {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
      <div className="relative w-[90%] max-w-md h-[80%] bg-black rounded-2xl overflow-hidden shadow-2xl animate-scaleIn">
        {/* Header */}
        <div className="absolute top-0 left-0 w-full flex items-center justify-between p-4 z-10">
          <div className="flex items-center gap-3">
            {/* <Image
              src={story.image}
              alt={story.name}
              fill
              className=" relative w-10 h-10 rounded-full"
            /> */}
            <span className="text-white text-sm">{story.name}</span>
          </div>

          <button
            onClick={onClose}
            className="text-white hover:scale-110 transition"
          >
            <X size={22} />
          </button>
        </div>

        {/* Content */}
        <Image
          src={story.image}
          alt={story.name}
          fill
          className=" relative w-full h-full object-cover"
        />
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scaleIn {
          from {
            transform: scale(0.9);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-in-out;
        }

        .animate-scaleIn {
          animation: scaleIn 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
}
