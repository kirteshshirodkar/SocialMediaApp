"use client";

import Image from "next/image";
import { Heart, MessageCircle, Share2 } from "lucide-react";
import { UserButton, useUser } from "@clerk/nextjs";
import EditProfile from "./EditProfile";

export default function ProfileHeader({
  profileUser,
}: {
  profileUser: {
    username: string | null;
    firstName: string | null;
    lastName: string | null;
    imageUrl: string | null;
    bio: string | null;
  };
}) {
  const { user } = useUser();

  const isOwnProfile =
    user?.username === profileUser.username;

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
      {/* Banner */}
      <div className="relative w-full h-40 md:h-56 rounded-3xl overflow-hidden shadow-xl">
        <Image
          src="https://images.unsplash.com/photo-1503264116251-35a269479413"
          alt="cover"
          fill
          className="object-cover"
          priority
          unoptimized
        />

        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/30 via-blue-500/20 to-transparent" />
      </div>

      {/* Avatar */}
      <div className="flex justify-center md:justify-start">
        <div className="-mt-16 md:-mt-20 relative z-10">
          <div className="w-28 h-28 md:w-32 md:h-32 rounded-full border-4 border-white shadow-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
            <UserButton />
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-col md:flex-row md:justify-between gap-6">
        <div className="flex flex-col items-center md:items-start">

          <h1 className="text-3xl font-semibold">
            {profileUser.username}
          </h1>

          <p className="text-gray-500 mt-1">
            {profileUser.bio || "No bio added yet"}
          </p>

          <div className="flex gap-6 mt-5">
            {stats.map((stat) => (
              <div key={stat.label}>
                <h2 className="font-bold">{stat.value}</h2>
                <p className="text-sm text-gray-500">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center md:items-end gap-4">

          <div className="flex gap-3">
            {socials.map((social, index) => (
              <div
                key={index}
                className="w-10 h-10 rounded-full bg-white shadow-md flex justify-center items-center hover:scale-110 transition-all"
              >
                {social.icon}
              </div>
            ))}
          </div>

          {isOwnProfile ? (
            <EditProfile bio={profileUser.bio} />
          ) : (
            <button className="px-6 py-2 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 text-white">
              Follow
            </button>
          )}
        </div>
      </div>
    </div>
  );
}