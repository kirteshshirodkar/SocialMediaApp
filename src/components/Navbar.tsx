"use client";

import Link from "next/link";
import {
  Home,
  User,
  MessageCircle,
  Search,
  Flag,
  Settings,
} from "lucide-react";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [active, setActive] = useState("home");
  const [username, setUsername] = useState("");

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
    { id: "chat", icon: MessageCircle, link: "/chat" },
    { id: "search", icon: Search, link: "/search" },
    { id: "flag", icon: Flag, link: "/notifications" },
    { id: "settings", icon: Settings, link: "/settings" },
  ];

  return (
    <>
      {/* Desktop Nav */}
      <div className="hidden md:flex fixed top-4 left-1/2 -translate-x-1/2 z-50">
        <div className="flex items-center gap-6 bg-white/80 backdrop-blur-md px-6 py-3 rounded-full shadow-md">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.id}
                href={item.link}
                onClick={() => setActive(item.id)}
                className={`p-3 rounded-xl transition-all duration-200 ${
                  active === item.id
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
    </>
  );
}