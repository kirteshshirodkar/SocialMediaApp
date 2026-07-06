import CreatePostForm from "@/src/components/createPostComponents/CreatePostForm";

export default function CreatePage() {
  return (
    <main className="max-w-xl mx-auto p-5">
      <h1 className="text-3xl font-bold mb-6">
        Create Post
      </h1>

      <CreatePostForm />
    </main>
  );
}