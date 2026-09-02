import PostCard from "@/src/components/homePageComponents/PostCard";
import ProfileHeader from "@/src/components/profilePageComponents/ProfileHeader";
import { CurrentUserProvider } from "@/src/context/CurrentUserContext";
import { getCurrentUser } from "@/src/lib/getCurrentUser";
import { postInclude } from "@/src/lib/postInclude";
import { prisma } from "@/src/lib/prisma";

export default async function Page({
  params,
}: {
  params: Promise<{
    username: string;
  }>;
}) {
  const { username } = await params;

  const currentUser = await getCurrentUser();

  const profileUser = await prisma.user.findUnique({
    where: {
      username,
    },
    select: {
      id: true,
      username: true,
      firstName: true,
      lastName: true,
      imageUrl: true,
      bio: true,

      _count: {
        select: {
          posts: true,
          followers: true,
          following: true,
        },
      },

      // Check whether the logged-in user follows this profile
      followers: currentUser
        ? {
            where: {
              followerId: currentUser.id,
            },
            select: {
              id: true,
            },
            take: 1,
          }
        : false,
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

  const isOwnProfile = currentUser?.id === profileUser.id;

  const isFollowing =
    !isOwnProfile &&
    "followers" in profileUser &&
    profileUser.followers.length > 0;

  return (
    <div>
      <ProfileHeader
        profileUser={{
          id: profileUser.id,
          username: profileUser.username,
          firstName: profileUser.firstName,
          lastName: profileUser.lastName,
          imageUrl: profileUser.imageUrl,
          bio: profileUser.bio,
          postsCount: profileUser._count.posts,
          followersCount: profileUser._count.followers,
          followingCount: profileUser._count.following,
          isFollowing,
          isOwnProfile,
        }}
      />

      <CurrentUserProvider
        currentUserId={currentUser?.id ?? ""}
      >
        <PostCard
          posts={userPosts}
          variant="profile"
        />
      </CurrentUserProvider>
    </div>
  );
}