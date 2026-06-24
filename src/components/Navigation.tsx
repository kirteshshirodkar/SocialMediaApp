"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  Home,
  Search,
  PlusSquare,
  Heart,
  User,
} from "lucide-react";

const navItems = [
  { name: "Home", icon: Home, href: "/" },
  { name: "Search", icon: Search, href: "/search" },
  { name: "Create", icon: PlusSquare, href: "/create" },
  { name: "Activity", icon: Heart, href: "/activity" },
  { name: "Profile", icon: User, href: "/profile" },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <>
      {/* DESKTOP SIDEBAR */}
      <aside className="hidden md:flex flex-col justify-between h-screen w-20 bg-white border-r px-3 py-6">
        
        <div className="flex flex-col gap-6 items-center">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link key={item.name} href={item.href}>
                <motion.div
                  whileTap={{ scale: 0.9 }}
                  className="relative flex items-center justify-center"
                >
                  {/* Active Background Animation */}
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute w-12 h-12 bg-blue-500 rounded-xl"
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    />
                  )}

                  <Icon
                    size={22}
                    className={`relative z-10 ${
                      isActive ? "text-white" : "text-gray-500"
                    }`}
                  />
                </motion.div>
              </Link>
            );
          })}
        </div>

        {/* Bottom Profile */}
        <div className="flex justify-center">
          <div className="w-10 h-10 rounded-full bg-gray-300" />
        </div>
      </aside>

      {/* MOBILE BOTTOM NAV */}
      <nav className="fixed bottom-0 left-0 w-full bg-white border-t flex justify-around items-center py-2 md:hidden">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link key={item.name} href={item.href}>
              <motion.div
                whileTap={{ scale: 0.85 }}
                className="relative flex flex-col items-center justify-center"
              >
                {isActive && (
                  <motion.div
                    layoutId="activeMobile"
                    className="absolute -top-1 w-10 h-10 bg-blue-500 rounded-full"
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  />
                )}

                <Icon
                  size={22}
                  className={`relative z-10 ${
                    isActive ? "text-white" : "text-gray-500"
                  }`}
                />
              </motion.div>
            </Link>
          );
        })}
      </nav>
    </>
  );
}