export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";

import Advertisment from "../components/homePageComponents/Advertisment";
import PostCard from "../components/homePageComponents/PostCard";
import Sidebar from "../components/homePageComponents/Sidebar";
import Stories from "../components/homePageComponents/Stories";

import { prisma } from "@/src/lib/prisma";
import { postInclude } from "@/src/lib/postInclude";
import { getCurrentUser } from "@/src/lib/getCurrentUser";
import { CurrentUserProvider } from "@/src/context/CurrentUserContext";

export default async function Home() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/sign-in");
  }

  const posts = await prisma.post.findMany({
    where: {
      OR: [
        {
          userId: currentUser.id,
        },
        {
          user: {
            followers: {
              some: {
                followerId: currentUser.id,
              },
            },
          },
        },
      ],
    },
    include: {
      ...postInclude,

      // Fetch only the current user's like record
      likes: {
        where: {
          userId: currentUser.id,
        },
        select: {
          id: true,
        },
      },
    },

    orderBy: {
      createdAt: "desc",
    },
  });

  const postsWithLikeStatus = posts.map((post) => ({
    ...post,
    isLiked: post.likes.length > 0,
  }));

  return (
    <div className="flex min-h-screen bg-[#F5F7FB]">
      {/* Left sidebar */}
      <div className="fixed left-6 top-28 hidden md:block">
        <Sidebar />
      </div>

      {/* Right advertisement */}
      <div className="fixed right-6 top-28 hidden h-[calc(100vh-7rem)] lg:block">
        <Advertisment />
      </div>

      {/* Main content */}
      <div className="flex-1 md:ml-[300px] lg:mr-[340px]">
        <div className="mt-6 flex justify-center px-4">
          <div className="w-full max-w-2xl space-y-6">
            <Stories />

            <CurrentUserProvider currentUserId={currentUser.id}>
              {postsWithLikeStatus.length > 0 ? (
                <PostCard posts={postsWithLikeStatus} variant="home" />
              ) : (
                <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Your feed is empty
                  </h2>

                  <p className="mt-2 text-sm text-gray-500">
                    Follow some users to see their posts here.
                  </p>
                </div>
              )}
            </CurrentUserProvider>
          </div>
        </div>
      </div>
    </div>
  );
}
