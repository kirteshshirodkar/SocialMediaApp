"use client";

import { Search, User } from "lucide-react";
import { UserButton } from "@clerk/nextjs";

const groups = [
  { name: "Figma Community", icon: "🎨" },
  { name: "Sketch Community", icon: "💎" },
];

const friends = [
  {
    name: "Eleanor Pena",
    time: "11 min",
    online: false,
    img: "/avatars/1.jpg",
  },
  { name: "Leslie Alexander", online: true, img: "/avatars/2.jpg" },
  { name: "Brooklyn Simmons", online: true, initials: "BS" },
  { name: "Arlene McCoy", time: "11 min", img: "/avatars/3.jpg" },
  { name: "Jerome Bell", time: "9 min", img: "/avatars/4.jpg" },
  { name: "Darlene Robertson", online: true, img: "/avatars/5.jpg" },
  { name: "Kathryn Murphy", online: true, img: "/avatars/6.jpg" },
  { name: "Theresa Webb", time: "11 min", img: "/avatars/7.jpg" },
  { name: "Darrell Steward", online: true, img: "/avatars/8.jpg" },
];

export default function Sidebar() {
  return (
    <aside className="w-[300px] h-[calc(100vh-7rem)] overflow-hidden bg-gray-100 rounded-r-3xl p-5 flex flex-col gap-6">
      
      {/* Top */}
      <div className="flex items-center gap-3">
        <UserButton
          appearance={{
            elements: {
              avatarBox: "w-10 h-10",
            },
          }}
        />

        <div className="flex-1 flex items-center bg-gray-200 px-3 py-2 rounded-full">
          <Search size={18} className="text-gray-500" />
          <input
            type="text"
            placeholder="Search"
            className="bg-transparent outline-none ml-2 text-sm w-full"
          />
        </div>
      </div>

      {/* Groups */}
      <div>
        <p className="text-xs text-gray-400 font-semibold mb-3">
          YOUR GROUP
        </p>

        <div className="flex flex-col gap-3">
          {groups.map((group, i) => (
            <div key={i} className="flex items-center gap-3 cursor-pointer">
              <div className="w-9 h-9 bg-white rounded-full flex items-center justify-center shadow">
                {group.icon}
              </div>
              <span className="text-sm font-medium">{group.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Friends */}
      <div className="flex-1 overflow-y-auto pr-1">
        <p className="text-xs text-gray-400 font-semibold mb-3">
          FRIENDS
        </p>

        <div className="flex flex-col gap-4">
          {friends.map((friend, i) => (
            <div
              key={i}
              className="flex items-center justify-between cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                    <User size={18} className="text-gray-600" />
                  </div>

                  {friend.online && (
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-teal-400 border-2 border-white rounded-full"></span>
                  )}
                </div>

                <span className="text-sm font-medium">
                  {friend.name}
                </span>
              </div>

              {friend.time && (
                <span className="text-xs text-gray-400">
                  {friend.time}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}