import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Download, Play } from "lucide-react";
import { useUser } from "@/lib/AuthContext";
import axiosInstance from "@/lib/axiosinstance";
import { Button } from "@/components/ui/button";

interface DownloadItem {
  _id: string;
  userPlan: string;
  downloadedAt: string;
  videoid: {
    _id: string;
    videotitle: string;
    filename: string;
    filepath: string;
    videochanel: string;
  } | null;
}

const DownloadsPage = () => {
  const { user } = useUser();

  const [downloads, setDownloads] = useState<DownloadItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [plan, setPlan] = useState("free");
  const [dailyLimit, setDailyLimit] = useState(1);
  const [todayDownloads, setTodayDownloads] = useState(0);
  const [remainingDownloads, setRemainingDownloads] = useState(0);

  useEffect(() => {
    if (!user?._id) {
      setLoading(false);
      return;
    }

    loadDownloads();
  }, [user?._id]);

  const loadDownloads = async () => {
    if (!user?._id) return;

    try {
      setLoading(true);

      const [downloadsRes, statusRes] = await Promise.all([
        axiosInstance.get(`/download/user/${user._id}`),
        axiosInstance.get(`/download/status/${user._id}`),
      ]);

      setDownloads(downloadsRes.data.downloads || []);

      setPlan(statusRes.data.plan || "free");
      setDailyLimit(statusRes.data.dailyLimit || 1);
      setTodayDownloads(statusRes.data.todayDownloads || 0);
      setRemainingDownloads(
        statusRes.data.remainingDownloads || 0
      );
    } catch (error) {
      console.error("Error loading downloads:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-2">Downloads</h1>

        <p className="text-gray-600">
          Please sign in to view your downloaded videos.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-8">
        <p>Loading downloads...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Download className="w-7 h-7" />

        <div>
          <h1 className="text-2xl font-bold">Downloads</h1>

          <p className="text-sm text-gray-600">
            Videos saved to your Vid-Ora Downloads
          </p>
        </div>
      </div>

      <div className="border rounded-xl p-4 mb-8">
        <div className="flex flex-wrap gap-6 text-sm">
          <div>
            <p className="text-gray-500">Plan</p>

            <p className="font-semibold capitalize">
              {plan}
            </p>
          </div>

          <div>
            <p className="text-gray-500">Daily limit</p>

            <p className="font-semibold">
              {dailyLimit}
            </p>
          </div>

          <div>
            <p className="text-gray-500">
              Downloaded today
            </p>

            <p className="font-semibold">
              {todayDownloads}
            </p>
          </div>

          <div>
            <p className="text-gray-500">
              Remaining today
            </p>

            <p className="font-semibold">
              {remainingDownloads}
            </p>
          </div>

          <div>
            <p className="text-gray-500">
              Total downloads
            </p>

            <p className="font-semibold">
              {downloads.length}
            </p>
          </div>
        </div>
      </div>

      {downloads.length === 0 ? (
        <div className="border rounded-xl p-10 text-center">
          <Download className="w-12 h-12 mx-auto mb-4 text-gray-400" />

          <h2 className="font-semibold text-lg">
            No downloads yet
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Videos you download will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {downloads.map((item) => {
            const video = item.videoid;

            if (!video) return null;

            return (
              <div
                key={item._id}
                className="border rounded-xl p-4 flex items-center justify-between gap-4"
              >
                <div className="min-w-0">
                  <h2 className="font-semibold truncate">
                    {video.videotitle}
                  </h2>

                  <p className="text-sm text-gray-600">
                    {video.videochanel}
                  </p>

                  <p className="text-xs text-gray-500 mt-1">
                    Downloaded{" "}
                    {new Date(
                      item.downloadedAt
                    ).toLocaleString()}
                  </p>

                  <p className="text-xs text-gray-500 capitalize">
                    Plan: {item.userPlan}
                  </p>
                </div>

                <Link href={`/watch/${video._id}`}>
                  <Button>
                    <Play className="w-4 h-4 mr-2" />
                    Play
                  </Button>
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DownloadsPage;