"use client";

import Image from "next/image";
import Link from "next/link";
import { Loader2, User, X } from "lucide-react";
import { useEffect, useState } from "react";

type ConnectionType = "followers" | "following";

type ConnectionUser = {
  id: string;
  username: string;
  firstName: string | null;
  lastName: string | null;
  imageUrl: string | null;
  bio: string | null;
};

type ConnectionsModalProps = {
  open: boolean;
  onClose: () => void;
  userId: string;
  type: ConnectionType;
};

export default function ConnectionsModal({
  open,
  onClose,
  userId,
  type,
}: ConnectionsModalProps) {
  const [users, setUsers] = useState<ConnectionUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) {
      return;
    }

    const controller = new AbortController();

    const fetchConnections = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(
          `/api/users/${userId}/connections?type=${type}`,
          {
            signal: controller.signal,
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error || "Unable to fetch users"
          );
        }

        setUsers(data.users);
      } catch (error) {
        if (
          error instanceof Error &&
          error.name !== "AbortError"
        ) {
          setError(error.message);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchConnections();

    return () => {
      controller.abort();
    };
  }, [open, type, userId]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener(
        "keydown",
        handleEscape
      );

      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  const title =
    type === "followers" ? "Followers" : "Following";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b px-5 py-4">
          <h2 className="text-lg font-semibold">
            {title}
          </h2>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="rounded-full p-2 transition hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        <div className="max-h-[65vh] overflow-y-auto p-3">
          {loading && (
            <div className="flex justify-center py-12">
              <Loader2
                className="animate-spin text-purple-500"
                size={28}
              />
            </div>
          )}

          {!loading && error && (
            <p className="py-10 text-center text-sm text-red-500">
              {error}
            </p>
          )}

          {!loading && !error && users.length === 0 && (
            <p className="py-10 text-center text-sm text-gray-500">
              No {type} yet.
            </p>
          )}

          {!loading &&
            !error &&
            users.map((connectionUser) => {
              const fullName = [
                connectionUser.firstName,
                connectionUser.lastName,
              ]
                .filter(Boolean)
                .join(" ");

              return (
                <Link
                  key={connectionUser.id}
                  href={`/profile/${connectionUser.username}`}
                  onClick={onClose}
                  className="flex items-center gap-3 rounded-xl p-3 transition hover:bg-gray-50"
                >
                  <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-purple-500 to-blue-500">
                    {connectionUser.imageUrl ? (
                      <Image
                        src={connectionUser.imageUrl}
                        alt={`${connectionUser.username} profile`}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    ) : (
                      <User
                        size={22}
                        className="text-white"
                      />
                    )}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate font-semibold text-gray-900">
                      {connectionUser.username}
                    </p>

                    {fullName && (
                      <p className="truncate text-sm text-gray-500">
                        {fullName}
                      </p>
                    )}

                    {connectionUser.bio && (
                      <p className="truncate text-xs text-gray-400">
                        {connectionUser.bio}
                      </p>
                    )}
                  </div>
                </Link>
              );
            })}
        </div>
      </div>
    </div>
  );
}