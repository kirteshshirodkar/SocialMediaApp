import { auth } from "@clerk/nextjs/server";
import PostCard from "@/src/components/homePageComponents/PostCard";
import ProfileHeader from "@/src/components/profilePageComponents/ProfileHeader";
import { prisma } from "@/src/lib/prisma";
import { postInclude } from "@/src/lib/postInclude";
import { CurrentUserProvider } from "@/src/context/CurrentUserContext";
import { getCurrentUser } from "@/src/lib/getCurrentUser";

export default async function Page({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;

 const currentUser = await getCurrentUser();

  const profileUser = await prisma.user.findUnique({
    where: {
      username,
    },
  });

  if (!profileUser) {
    return <div>User not found</div>;
  }

  const userPosts = await prisma.post.findMany({
    where: {
      userId: profileUser.id,
    },
    include: postInclude,
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div>
      <ProfileHeader profileUser={profileUser} />

      <CurrentUserProvider currentUserId={currentUser?.id ?? ""}>
        <PostCard posts={userPosts} variant="profile" />
      </CurrentUserProvider>
    </div>
  );
}