export const dynamic = "force-dynamic";
import Advertisment from "../components/homePageComponents/Advertisment";
import PostCard from "../components/homePageComponents/PostCard";
import Sidebar from "../components/homePageComponents/Sidebar";
import Stories from "../components/homePageComponents/Stories";
import { prisma } from "@/src/lib/prisma";
import { postInclude } from "@/src/lib/postInclude";
import { getCurrentUser } from "@/src/lib/getCurrentUser";
import { CurrentUserProvider } from "@/src/context/CurrentUserContext";
export default async function Home() {
  const posts = await prisma.post.findMany({
    include: postInclude,
    orderBy: {
      createdAt: "desc",
    },
  });
  const currentUser = await getCurrentUser();
  console.log("Fetching posts...");
  return (
    <div className="flex bg-[#F5F7FB] min-h-screen">
      {/* LEFT SIDEBAR */}
      <div className="hidden md:block fixed top-28 left-6">
        <Sidebar />
      </div>

      {/* RIGHT ADVERTISEMENT */}
      <div className="hidden lg:block fixed top-28 right-6 h-[calc(100vh-7rem)]">
        <Advertisment />
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 md:ml-[300px] lg:mr-[340px]">
        <div className="flex justify-center mt-6 px-4">
          <div className="w-full max-w-2xl space-y-6">
            <Stories />
            <CurrentUserProvider currentUserId={currentUser?.id ?? ""}>
              <PostCard posts={posts} variant="home" />
            </CurrentUserProvider>
          </div>
        </div>
      </div>
    </div>
  );
}
