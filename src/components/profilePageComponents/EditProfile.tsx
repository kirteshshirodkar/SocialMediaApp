"use client";

import { useState } from "react";
import { Pencil, X } from "lucide-react";
import { useRouter } from "next/navigation";



export default function EditProfile({ bio }: { bio: string | null }) {
  const [open, setOpen] = useState(false);
  const [newBio, setNewBio] = useState(bio || "");
  const router = useRouter();

  const handleSave = async () => {
  await fetch("/api/profile", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      bio: newBio,
    }),
  });

  router.refresh();
  setOpen(false);
};

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:scale-105 transition-all"
      >
        <Pencil size={16} />
        Edit Profile
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl p-6 w-[90%] max-w-md shadow-xl">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Edit Profile</h2>

              <button onClick={() => setOpen(false)}>
                <X />
              </button>
            </div>

            <div className="mt-6">
              <label className="block text-sm mb-2">Bio</label>

              <textarea
                rows={4}
                value={newBio}
                onChange={(e) => setNewBio(e.target.value)}
                className="w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Frontend Developer..."
              />
            </div>

            <button
              onClick={handleSave}
              className="mt-6 w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 rounded-xl"
            >
              Save Changes
            </button>
          </div>
        </div>
      )}
    </>
  );
}
