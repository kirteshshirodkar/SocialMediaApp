import PostCard from "@/src/components/homePageComponents/PostCard";
import Navbar from "@/src/components/Navbar";
import ProfileHeader from "@/src/components/profilePageComponents/ProfileHeader";
import { prisma } from "@/src/lib/prisma";

import React from "react";

export default async function Page({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
   console.log("Username:", username);

  const profileUser = await prisma.user.findUnique({
    where: {
      username,
    },
  });

  if (!profileUser) {
    return <div>User not found</div>;
  }

 

  return (
    <div>
      <ProfileHeader profileUser={profileUser} />
      <PostCard variant="profile" />
    </div>
  );
}
