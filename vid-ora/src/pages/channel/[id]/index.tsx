import ChannelHeader from "@/components/ChannelHeader";
import Channeltabs from "@/components/Channeltabs";
import ChannelVideos from "@/components/ChannelVideos";
import VideoUploader from "@/components/VideoUploader";
import { Button } from "@/components/ui/button";
import { useUser } from "@/lib/AuthContext";
import axiosInstance from "@/lib/axiosinstance";
import { Download } from "lucide-react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

const Index = () => {
  const router = useRouter();
  const { id } = router.query;
  const { user } = useUser();

  const [downloadCount, setDownloadCount] = useState(0);
  const [downloadPlan, setDownloadPlan] = useState("free");
  const [remainingDownloads, setRemainingDownloads] = useState(0);

  useEffect(() => {
    const loadDownloadInfo = async () => {
      if (!user?._id) return;

      try {
        const [downloadsRes, statusRes] = await Promise.all([
          axiosInstance.get(`/download/user/${user._id}`),
          axiosInstance.get(`/download/status/${user._id}`),
        ]);

        setDownloadCount(
          downloadsRes.data.totalDownloads ??
            downloadsRes.data.downloads?.length ??
            0
        );

        setDownloadPlan(statusRes.data.plan || "free");

        setRemainingDownloads(
          statusRes.data.remainingDownloads || 0
        );
      } catch (error) {
        console.error("Error loading download information:", error);
      }
    };

    loadDownloadInfo();
  }, [user?._id]);

  try {
    const channel = user;

    const videos = [
      {
        _id: "1",
        videotitle: "Amazing Nature Documentary",
        filename: "nature-doc.mp4",
        filetype: "video/mp4",
        filepath: "/videos/nature-doc.mp4",
        filesize: "500MB",
        videochanel: "Nature Channel",
        Like: 1250,
        views: 45000,
        uploader: "nature_lover",
        createdAt: new Date().toISOString(),
      },
      {
        _id: "2",
        videotitle: "Cooking Tutorial: Perfect Pasta",
        filename: "pasta-tutorial.mp4",
        filetype: "video/mp4",
        filepath: "/videos/pasta-tutorial.mp4",
        filesize: "300MB",
        videochanel: "Chef's Kitchen",
        Like: 890,
        views: 23000,
        uploader: "chef_master",
        createdAt: new Date(Date.now() - 86400000).toISOString(),
      },
    ];

    return (
      <div className="flex-1 min-h-screen bg-white">
        <div className="max-w-full mx-auto">
          <ChannelHeader channel={channel} user={user} />

          <Channeltabs />

          {user && (
            <div className="px-4 pb-8">
              <div className="border rounded-xl p-5">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="bg-gray-100 rounded-full p-3">
                      <Download className="w-6 h-6" />
                    </div>

                    <div>
                      <h2 className="text-lg font-semibold">
                        Downloads
                      </h2>

                      <p className="text-sm text-gray-600">
                        {downloadCount} downloaded video
                        {downloadCount === 1 ? "" : "s"}
                      </p>

                      <div className="flex gap-3 mt-1 text-xs text-gray-500">
                        <span className="capitalize">
                          Plan: {downloadPlan}
                        </span>

                        <span>
                          Remaining today: {remainingDownloads}
                        </span>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={() => router.push("/downloads")}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Open Downloads
                  </Button>
                </div>
              </div>
            </div>
          )}

          <div className="px-4 pb-8">
            <VideoUploader
              channelId={id}
              channelName={channel?.channelname}
            />
          </div>

          <div className="px-4 pb-8">
            <ChannelVideos videos={videos} />
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error fetching channel data:", error);

    return (
      <div className="p-6">
        Unable to load channel.
      </div>
    );
  }
};

export default Index;