"use client";

import Image from "next/image";
import {
  Heart,
  Loader2,
  MessageCircle,
  Share2,
  User,
} from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import { useState } from "react";

import EditProfile from "./EditProfile";
import ConnectionsModal from "./ConnectionsModal";

type ConnectionType = "followers" | "following";

type ProfileUser = {
  id: string;
  username: string;
  firstName: string | null;
  lastName: string | null;
  imageUrl: string | null;
  bio: string | null;
  postsCount: number;
  followersCount: number;
  followingCount: number;
  isFollowing: boolean;
  isOwnProfile: boolean;
};

export default function ProfileHeader({
  profileUser,
}: {
  profileUser: ProfileUser;
}) {
  const [isFollowing, setIsFollowing] = useState(
    profileUser.isFollowing
  );

  const [followersCount, setFollowersCount] = useState(
    profileUser.followersCount
  );

  const [followLoading, setFollowLoading] =
    useState(false);

  const [followError, setFollowError] = useState("");

  const [modalType, setModalType] =
    useState<ConnectionType | null>(null);

  const handleFollow = async () => {
    if (followLoading) {
      return;
    }

    setFollowLoading(true);
    setFollowError("");

    try {
      const response = await fetch(
        `/api/users/${profileUser.id}/follow`,
        {
          method: isFollowing ? "DELETE" : "POST",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Unable to update follow"
        );
      }

      setIsFollowing(data.isFollowing);
      setFollowersCount(data.followersCount);
    } catch (error) {
      setFollowError(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );
    } finally {
      setFollowLoading(false);
    }
  };

  const socials = [
    { icon: <Heart size={18} /> },
    { icon: <MessageCircle size={18} /> },
    { icon: <Share2 size={18} /> },
  ];

  return (
    <>
      <div className="mx-auto w-full max-w-5xl p-4">
        {/* Banner */}
        <div className="relative h-40 w-full overflow-hidden rounded-3xl shadow-xl md:h-56">
          <Image
            src="https://images.unsplash.com/photo-1503264116251-35a269479413"
            alt="Profile cover"
            fill
            sizes="(max-width: 768px) 100vw, 1024px"
            className="object-cover"
            priority
            unoptimized
          />

          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/30 via-blue-500/20 to-transparent" />
        </div>

        {/* Avatar */}
        <div className="flex justify-center md:justify-start">
          <div className="relative z-10 -mt-16 md:-mt-20">
            <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-gradient-to-br from-purple-500 to-blue-500 shadow-xl md:h-32 md:w-32">
              {profileUser.isOwnProfile ? (
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox:
                        "w-24 h-24 md:w-28 md:h-28",
                    },
                  }}
                />
              ) : profileUser.imageUrl ? (
                <Image
                  src={profileUser.imageUrl}
                  alt={`${profileUser.username} profile picture`}
                  width={128}
                  height={128}
                  className="h-full w-full object-cover"
                />
              ) : (
                <User
                  size={52}
                  className="text-white"
                />
              )}
            </div>
          </div>
        </div>

        {/* Profile content */}
        <div className="mt-4 flex flex-col gap-6 md:flex-row md:justify-between">
          <div className="flex flex-col items-center md:items-start">
            <h1 className="text-3xl font-semibold">
              {profileUser.username}
            </h1>

            <p className="mt-1 text-gray-500">
              {profileUser.bio || "No bio added yet"}
            </p>

            {/* Stats */}
            <div className="mt-5 flex gap-6">
              <div className="text-center md:text-left">
                <h2 className="font-bold">
                  {profileUser.postsCount}
                </h2>
                <p className="text-sm text-gray-500">
                  Posts
                </p>
              </div>

              <button
                type="button"
                onClick={() => setModalType("followers")}
                className="text-center transition hover:text-purple-600 md:text-left"
              >
                <h2 className="font-bold">
                  {followersCount}
                </h2>
                <p className="text-sm text-gray-500">
                  Followers
                </p>
              </button>

              <button
                type="button"
                onClick={() => setModalType("following")}
                className="text-center transition hover:text-purple-600 md:text-left"
              >
                <h2 className="font-bold">
                  {profileUser.followingCount}
                </h2>
                <p className="text-sm text-gray-500">
                  Following
                </p>
              </button>
            </div>
          </div>

          <div className="flex flex-col items-center gap-4 md:items-end">
            <div className="flex gap-3">
              {socials.map((social, index) => (
                <div
                  key={index}
                  className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-white shadow-md transition-all duration-300 hover:scale-110 hover:shadow-lg"
                >
                  {social.icon}
                </div>
              ))}
            </div>

            {profileUser.isOwnProfile ? (
              <EditProfile bio={profileUser.bio} />
            ) : (
              <div className="flex flex-col items-center md:items-end">
                <button
                  type="button"
                  onClick={handleFollow}
                  disabled={followLoading}
                  className={`flex min-w-28 items-center justify-center gap-2 rounded-full px-6 py-2 font-medium shadow-lg transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-60 ${
                    isFollowing
                      ? "border border-gray-300 bg-white text-gray-800 hover:bg-gray-100"
                      : "bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:scale-105"
                  }`}
                >
                  {followLoading && (
                    <Loader2
                      size={17}
                      className="animate-spin"
                    />
                  )}

                  {isFollowing ? "Following" : "Follow"}
                </button>

                {followError && (
                  <p className="mt-2 text-sm text-red-500">
                    {followError}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {modalType && (
        <ConnectionsModal
          open={true}
          onClose={() => setModalType(null)}
          userId={profileUser.id}
          type={modalType}
        />
      )}
    </>
  );
}