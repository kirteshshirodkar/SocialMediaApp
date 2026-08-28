"use client";

import Image from "next/image";
import Link from "next/link";
import { Loader2, Search, User } from "lucide-react";
import { useEffect, useState } from "react";

type SearchUser = {
  id: string;
  username: string;
  firstName: string | null;
  lastName: string | null;
  imageUrl: string | null;
  bio: string | null;
};

export default function UserSearch() {
  const [query, setQuery] = useState("");

  const [users, setUsers] = useState<SearchUser[]>([]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setUsers([]);
      return;
    }

    const searchUsers = async () => {
      try {
        setLoading(true);

        const response = await fetch(
          `/api/users/search?q=${encodeURIComponent(query)}`
        );

        if (!response.ok) {
          throw new Error("Failed to search users");
        }

        const data = await response.json();

        setUsers(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    const timeout = setTimeout(searchUsers, 300);

    return () => clearTimeout(timeout);
  }, [query]);

  return (
    <div className="relative w-full">
      {/* SEARCH BAR */}

      <div className="flex items-center gap-3 bg-white rounded-xl border px-4 py-3 shadow-sm">
        <Search
          size={20}
          className="text-gray-400"
        />

        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search users..."
          className="w-full outline-none bg-transparent"
        />

        {loading && (
          <Loader2
            size={18}
            className="animate-spin text-gray-400"
          />
        )}
      </div>

      {/* RESULTS */}

      {query && (
        <div
          className="
            absolute
            top-full
            left-0
            right-0
            mt-2
            bg-white
            border
            rounded-xl
            shadow-lg
            overflow-hidden
            z-50
          "
        >
          {!loading && users.length === 0 && (
            <div className="p-5 text-center text-gray-500">
              No users found
            </div>
          )}

          {users.map((user) => (
            <Link
              key={user.id}
              href={`/profile/${user.username}`}
              onClick={() => setQuery("")}
              className="
                flex
                items-center
                gap-3
                p-3
                hover:bg-gray-50
                transition
              "
            >
              {/* PROFILE IMAGE */}

              <div className="relative w-11 h-11 rounded-full overflow-hidden bg-gray-100">
                {user.imageUrl ? (
                  <Image
                    src={user.imageUrl}
                    alt={user.username}
                    fill
                    sizes="44px"
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User size={20} />
                  </div>
                )}
              </div>

              {/* USER INFO */}

              <div>
                <p className="font-semibold text-sm">
                  {user.firstName || user.lastName
                    ? `${user.firstName ?? ""} ${
                        user.lastName ?? ""
                      }`
                    : user.username}
                </p>

                <p className="text-xs text-gray-500">
                  @{user.username}
                </p>

                {user.bio && (
                  <p className="text-xs text-gray-400 line-clamp-1 mt-1">
                    {user.bio}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}