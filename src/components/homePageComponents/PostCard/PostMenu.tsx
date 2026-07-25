"use client";

import { MoreHorizontal, Trash2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";

type Props = {
  onDelete: () => void;
};

export default function PostMenu({ onDelete }: Props) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
  }, []);

  return (
    <div
      ref={menuRef}
      className="relative"
    >
      <button
        onClick={() => setOpen(!open)}
        className="text-gray-500 hover:text-black"
      >
        <MoreHorizontal size={20} />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-40 rounded-xl bg-white border shadow-lg z-50">
          <button
            onClick={() => {
              setOpen(false);
              onDelete();
            }}
            className="flex w-full items-center gap-2 px-4 py-3 text-red-500 hover:bg-gray-100"
          >
            <Trash2 size={16} />
            Delete Post
          </button>
        </div>
      )}
    </div>
  );
}