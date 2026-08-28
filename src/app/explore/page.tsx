import ExplorePage from "@/src/components/explorePageComponents/ExplorePage";
import { CurrentUserProvider } from "@/src/context/CurrentUserContext";
import { getCurrentUser } from "@/src/lib/getCurrentUser";

export const dynamic = "force-dynamic";

export default async function Page() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return <div>User not found</div>;
  }

  return (
    <CurrentUserProvider currentUserId={currentUser.id}>
      <main className="min-h-screen bg-[#F5F7FB]">
        <ExplorePage />
      </main>
    </CurrentUserProvider>
  );
}