"use client";

import { useState } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Avatar, AvatarFallback } from "./ui/avatar";

export default function VideoCard({ video }: any) {
  const [duration, setDuration] = useState("0:00");

  const formatDuration = (seconds: number) => {
    if (!Number.isFinite(seconds)) return "0:00";

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${secs
        .toString()
        .padStart(2, "0")}`;
    }

    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL || process.env.BACKEND_URL;

  return (
    <Link href={`/watch/${video?._id}`} className="group">
      <div className="space-y-3">
        <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100">
          <video
            src={`${backendUrl}/${video?.filepath}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
            preload="metadata"
            muted
            onLoadedMetadata={(e) => {
              const videoElement = e.currentTarget;
              setDuration(formatDuration(videoElement.duration));
            }}
          />

          <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1 rounded">
            {duration}
          </div>
        </div>

        <div className="flex gap-3">
          <Avatar className="w-9 h-9 flex-shrink-0">
            <AvatarFallback>
              {video?.videochanel?.[0]?.toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-sm line-clamp-2 group-hover:text-blue-600">
              {video?.videotitle}
            </h3>

            <p className="text-sm text-gray-600 mt-1">
              {video?.videochanel}
            </p>

            <p className="text-sm text-gray-600">
              {video?.views?.toLocaleString() || 0} views •{" "}
              {video?.createdAt
                ? formatDistanceToNow(new Date(video.createdAt))
                : "just now"}{" "}
              ago
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}