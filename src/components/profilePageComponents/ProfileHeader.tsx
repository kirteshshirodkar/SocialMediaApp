"use client";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import { Heart, MessageCircle, Share2, User } from "lucide-react";
import { UserButton } from "@clerk/nextjs";
export default function ProfileHeader({
  profileUser,
}: {
  profileUser: {
    username: string | null;
    firstName: string | null;
    lastName: string | null;
    imageUrl: string | null;
  };
}) {
  const { user } = useUser();
  const stats = [
    { label: "Posts", value: 120 },
    { label: "Followers", value: "12.5K" },
    { label: "Following", value: 320 },
  ];

  const socials = [
    { icon: <Heart size={18} /> },
    { icon: <MessageCircle size={18} /> },
    { icon: <Share2 size={18} /> },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto p-4">
      {/* 🔷 Banner */}
      <div className="relative w-full h-40 md:h-56 rounded-3xl overflow-hidden shadow-xl">
        <Image
          src="https://images.unsplash.com/photo-1503264116251-35a269479413"
          alt="cover"
          fill
          className="object-cover"
          priority
          unoptimized
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/30 via-blue-500/20 to-transparent" />
      </div>

      {/* 🔷 Avatar */}
      <div className="flex justify-center md:justify-start">
        <div className="-mt-16 md:-mt-20 relative z-10">
          <div className="w-28 h-28 md:w-32 md:h-32 rounded-full border-4 border-white shadow-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center transition-all duration-300 hover:scale-105">
            <UserButton />
          </div>
        </div>
      </div>

      {/* 🔷 Content */}
      <div className="mt-4 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        {/* LEFT SECTION */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          {/* Name */}
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">
            @{profileUser.username}
          </h1>

          {/* Role */}

          <p className="text-gray-500 mt-1">Frontend Developer</p>

          {/* Stats */}
          <div className="flex gap-6 mt-4">
            {stats.map((stat, index) => (
              <div key={index} className="text-center md:text-left">
                <p className="font-semibold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div className="flex flex-col items-center md:items-end gap-4">
          {/* Social Icons */}
          <div className="flex gap-3">
            {socials.map((social, index) => (
              <div
                key={index}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white/60 backdrop-blur-md shadow-md hover:scale-110 hover:shadow-lg transition-all duration-300 cursor-pointer"
              >
                {social.icon}
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <button className="px-6 py-2 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 text-white font-medium shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-300">
            Follow
          </button>
        </div>
      </div>
    </div>
  );
}
