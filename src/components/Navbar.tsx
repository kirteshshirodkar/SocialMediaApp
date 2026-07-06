"use client";

import Link from "next/link";
import {
  Home,
  User,
  Plus,
  Search,
  Flag,
  Settings,
} from "lucide-react";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [username, setUsername] = useState("");
  const pathname = usePathname();

  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch("/api/me");

      if (!res.ok) return;

      const data = await res.json();

      if (data?.username) {
        setUsername(data.username);
      }
    };

    fetchUser();
  }, []);

  const navItems = [
    { id: "home", icon: Home, link: "/" },
    {
      id: "users",
      icon: User,
      link: username ? `/profile/${username}` : "/profile",
    },
    { id: "add posts", icon: Plus, link: "/createPost" },
    { id: "search", icon: Search, link: "/search" },
    { id: "notifications", icon: Flag, link: "/notifications" },
    { id: "settings", icon: Settings, link: "/settings" },
  ];

  return (
  <>
    {/* LOGO DESKTOP */}
    <div className="hidden md:flex fixed top-4 left-8 z-50 items-center">
      <Link href="/" className="text-2xl font-bold">
        <span className="text-blue-600">Social</span>
        <span className="text-gray-900">Vibe</span>
      </Link>
    </div>

    {/* LOGO MOBILE */}
    <div className="md:hidden fixed top-4 left-1/2 -translate-x-1/2 -z-50">
      <Link href="/" className="text-xl font-bold">
        <span className="text-blue-600">Social</span>
        <span className="text-gray-900">Vibe</span>
      </Link>
    </div>

    {/* DESKTOP NAVBAR */}
    <div className="hidden md:flex fixed top-4 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-center gap-6 bg-white/80 backdrop-blur-md px-6 py-3 rounded-full shadow-md border border-gray-200">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.link ||
            (item.id === "users" && pathname.startsWith("/profile"));

          return (
            <Link
              key={item.id}
              href={item.link}
              className={`p-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? "bg-blue-500 text-white shadow-md"
                  : "text-gray-500 hover:bg-gray-200"
              }`}
            >
              <Icon size={20} />
            </Link>
          );
        })}
      </div>
    </div>

    {/* MOBILE BOTTOM NAVBAR */}
    <div className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t shadow-lg z-50">
      <div className="flex items-center justify-around py-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.link ||
            (item.id === "users" && pathname.startsWith("/profile"));

          return (
            <Link
              key={item.id}
              href={item.link}
              className={`p-2 ${
                isActive ? "text-blue-500" : "text-gray-500"
              }`}
            >
              <Icon size={24} />
            </Link>
          );
        })}
      </div>
    </div>
  </>
);
}