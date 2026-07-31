import Comments from "@/components/Comments";
import RelatedVideos from "@/components/RelatedVideos";
import VideoInfo from "@/components/VideoInfo";
import Videopplayer from "@/components/Videopplayer";
import axiosInstance from "@/lib/axiosinstance";
import { useUser } from "@/lib/AuthContext";
import Link from "next/link";
import { Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

const planRank: Record<string, number> = {
  free: 0,
  bronze: 1,
  silver: 2,
  gold: 3,
};

const Index = () => {
  const router = useRouter();
  const { id } = router.query;
  const { user } = useUser();

  const [videos, setvideo] = useState<any>(null);
  const [video, setvide] = useState<any>(null);
  const [loading, setloading] = useState(true);

  useEffect(() => {
    const fetchvideo = async () => {
      if (!id || typeof id !== "string") return;

      try {
        const res = await axiosInstance.get("/video/getall");

        const selectedVideo = res.data?.find((vid: any) => vid._id === id);

        setvideo(selectedVideo);
        setvide(res.data);
      } catch (error) {
        console.log(error);
      } finally {
        setloading(false);
      }
    };

    fetchvideo();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!videos) {
    return <div>Video not found</div>;
  }

  const userPlan = user?.plan || "free";
  const requiredPlan = videos.minimumPlan || "free";

  const hasAccess =
    planRank[userPlan] >= planRank[requiredPlan];

  if (!hasAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white shadow-lg rounded-xl p-10 text-center max-w-md">

          <Crown className="w-16 h-16 mx-auto text-yellow-500 mb-4" />

          <h2 className="text-2xl font-bold mb-3">
            Premium Content
          </h2>

          <p className="text-gray-600 mb-6">
            Your current plan doesn't allow access to this video.
            Upgrade your subscription to continue watching.
          </p>

          <Link href="/subscription">
            <Button className="w-full">
              Upgrade Plan
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <Videopplayer video={videos} />
            <VideoInfo video={videos} />
            <Comments videoId={id} />
          </div>

          <div className="space-y-4">
            <RelatedVideos videos={video} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;