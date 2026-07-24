import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { formatDistanceToNow } from "date-fns";
import { useUser } from "@/lib/AuthContext";
import axiosInstance from "@/lib/axiosinstance";

interface Report {
  userid: string;
  reason: string;
}

interface Comment {
  _id: string;
  videoid: string;
  userid: string;
  commentbody: string;
  usercommented: string;
  commentedon?: string;
  createdAt?: string;
  location?: string;
  showLocation?: boolean;
  likes?: string[];
  dislikes?: string[];
  reports?: Report[];
  flaggedForReview?: boolean;
}

const languages = [
  { name: "English", code: "en" },
  { name: "Hindi", code: "hi" },
  { name: "Spanish", code: "es" },
  { name: "French", code: "fr" },
  { name: "German", code: "de" },
];

const Comments = ({ videoId }: any) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [location, setLocation] = useState("");
  const [showLocation, setShowLocation] = useState(false);

  const [selectedLanguages, setSelectedLanguages] = useState<{
    [key: string]: string;
  }>({});

  const [translatedComments, setTranslatedComments] = useState<{
    [key: string]: string;
  }>({});

  const [translatingId, setTranslatingId] = useState<string | null>(null);

  const { user } = useUser();

  useEffect(() => {
    if (videoId) {
      loadComments();
    }
  }, [videoId]);

  const loadComments = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(`/comment/${videoId}`);
      setComments(res.data);
    } catch (error) {
      console.error("Error loading comments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async () => {
    if (!user || !newComment.trim()) return;

    try {
      setIsSubmitting(true);
      setMessage("");

      const res = await axiosInstance.post("/comment/postcomment", {
        videoid: videoId,
        userid: user._id,
        commentbody: newComment,
        usercommented: user.name || "Anonymous",
        location: showLocation ? location.trim() : "",
        showLocation,
      });

      setComments((prev) => [res.data, ...prev]);
      setNewComment("");
      setLocation("");
      setShowLocation(false);
    } catch (error: any) {
      setMessage(
        error?.response?.data?.message || "Unable to post comment."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (comment: Comment) => {
    setEditingCommentId(comment._id);
    setEditText(comment.commentbody);
    setMessage("");
  };

  const handleUpdateComment = async () => {
    if (!editText.trim() || !editingCommentId) return;

    try {
      setMessage("");

      const res = await axiosInstance.post(
        `/comment/editcomment/${editingCommentId}`,
        {
          commentbody: editText,
        }
      );

      setComments((prev) =>
        prev.map((comment) =>
          comment._id === editingCommentId ? res.data : comment
        )
      );

      setEditingCommentId(null);
      setEditText("");
    } catch (error: any) {
      setMessage(
        error?.response?.data?.message || "Unable to update comment."
      );
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axiosInstance.delete(`/comment/deletecomment/${id}`);

      setComments((prev) =>
        prev.filter((comment) => comment._id !== id)
      );
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const handleLike = async (id: string) => {
    if (!user) {
      setMessage("Please sign in to like comments.");
      return;
    }

    try {
      setMessage("");

      const res = await axiosInstance.post(`/comment/like/${id}`, {
        userid: user._id,
      });

      setComments((prev) =>
        prev.map((comment) =>
          comment._id === id ? res.data : comment
        )
      );
    } catch (error: any) {
      setMessage(
        error?.response?.data?.message || "Unable to like comment."
      );
    }
  };

  const handleDislike = async (id: string) => {
    if (!user) {
      setMessage("Please sign in to dislike comments.");
      return;
    }

    try {
      setMessage("");

      const res = await axiosInstance.post(`/comment/dislike/${id}`, {
        userid: user._id,
      });

      setComments((prev) =>
        prev.map((comment) =>
          comment._id === id ? res.data : comment
        )
      );
    } catch (error: any) {
      setMessage(
        error?.response?.data?.message || "Unable to dislike comment."
      );
    }
  };

  const handleReport = async (id: string) => {
    if (!user) {
      setMessage("Please sign in to report comments.");
      return;
    }

    const reason = window.prompt(
      "Why are you reporting this comment?",
      "Inappropriate content"
    );

    if (reason === null) return;

    try {
      setMessage("");

      const res = await axiosInstance.post(`/comment/report/${id}`, {
        userid: user._id,
        reason: reason || "Other",
      });

      if (res.data.comment) {
        setComments((prev) =>
          prev.map((comment) =>
            comment._id === id ? res.data.comment : comment
          )
        );
      }

      setMessage(
        "Comment reported successfully and flagged for review."
      );
    } catch (error: any) {
      setMessage(
        error?.response?.data?.message || "Unable to report comment."
      );
    }
  };

  const handleTranslate = async (comment: Comment) => {
    const targetLanguage = selectedLanguages[comment._id] || "en";

    try {
      setTranslatingId(comment._id);
      setMessage("");

      const res = await axiosInstance.post("/translate", {
        text: comment.commentbody,
        target: targetLanguage,
      });

      setTranslatedComments((prev) => ({
        ...prev,
        [comment._id]: res.data.translatedText,
      }));
    } catch (error: any) {
      console.error("Translation error:", error);

      setMessage(
        error?.response?.data?.message || "Unable to translate comment."
      );
    } finally {
      setTranslatingId(null);
    }
  };

  if (loading) {
    return <div>Loading comments...</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">
        {comments.length} Comments
      </h2>

      {message && (
        <div className="text-sm bg-gray-100 p-3 rounded-md">
          {message}
        </div>
      )}

      {user && (
        <div className="flex gap-4">
          <Avatar className="w-10 h-10">
            <AvatarImage src={user.image || ""} />
            <AvatarFallback>
              {user.name?.[0] || "U"}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 space-y-3">
            <Textarea
              placeholder="Add a comment in any language..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              maxLength={1000}
              className="min-h-[80px] resize-none border-0 border-b-2 rounded-none focus-visible:ring-0"
            />

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm text-gray-600">
                <input
                  type="checkbox"
                  checked={showLocation}
                  onChange={(e) => setShowLocation(e.target.checked)}
                />
                Share location with this comment
              </label>

              {showLocation && (
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Location (optional, e.g. India)"
                  maxLength={50}
                  className="w-full border rounded-md px-3 py-2 text-sm"
                />
              )}

              <p className="text-xs text-gray-500">
                Sharing your exact city is not required.
              </p>
            </div>

            <div className="flex gap-2 justify-end">
              <Button
                variant="ghost"
                onClick={() => {
                  setNewComment("");
                  setLocation("");
                  setShowLocation(false);
                  setMessage("");
                }}
                disabled={!newComment.trim()}
              >
                Cancel
              </Button>

              <Button
                onClick={handleSubmitComment}
                disabled={!newComment.trim() || isSubmitting}
              >
                {isSubmitting ? "Posting..." : "Comment"}
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {comments.length === 0 ? (
          <p className="text-sm text-gray-500 italic">
            No comments yet. Be the first to comment!
          </p>
        ) : (
          comments.map((comment) => {
            const commentDate =
              comment.createdAt || comment.commentedon;

            return (
              <div key={comment._id} className="flex gap-4">
                <Avatar className="w-10 h-10">
                  <AvatarImage src="" />
                  <AvatarFallback>
                    {comment.usercommented?.[0]?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="font-medium text-sm">
                      {comment.usercommented}
                    </span>

                    {commentDate && (
                      <span className="text-xs text-gray-500">
                        {formatDistanceToNow(new Date(commentDate))} ago
                      </span>
                    )}

                    {comment.showLocation && comment.location && (
                      <span className="text-xs text-gray-500">
                        • {comment.location}
                      </span>
                    )}
                  </div>

                  {editingCommentId === comment._id ? (
                    <div className="space-y-2">
                      <Textarea
                        value={editText}
                        maxLength={1000}
                        onChange={(e) => setEditText(e.target.value)}
                      />

                      <div className="flex gap-2">
                        <Button
                          onClick={handleUpdateComment}
                          disabled={!editText.trim()}
                        >
                          Save
                        </Button>

                        <Button
                          variant="ghost"
                          onClick={() => {
                            setEditingCommentId(null);
                            setEditText("");
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="text-sm whitespace-pre-wrap break-words">
                        {comment.commentbody}
                      </p>

                      {translatedComments[comment._id] && (
                        <div className="mt-2 p-3 bg-gray-100 rounded-md">
                          <p className="text-xs text-gray-500 mb-1">
                            Translation
                          </p>

                          <p className="text-sm">
                            {translatedComments[comment._id]}
                          </p>
                        </div>
                      )}

                      <div className="flex items-center gap-3 mt-3 text-sm text-gray-600 flex-wrap">
                        <button
                          onClick={() => handleLike(comment._id)}
                          className="hover:text-black"
                        >
                          Like ({comment.likes?.length || 0})
                        </button>

                        <button
                          onClick={() => handleDislike(comment._id)}
                          className="hover:text-black"
                        >
                          Dislike ({comment.dislikes?.length || 0})
                        </button>

                        <select
                          value={selectedLanguages[comment._id] || "en"}
                          onChange={(e) =>
                            setSelectedLanguages((prev) => ({
                              ...prev,
                              [comment._id]: e.target.value,
                            }))
                          }
                          className="border rounded px-2 py-1 bg-white text-sm"
                        >
                          {languages.map((language) => (
                            <option
                              key={language.code}
                              value={language.code}
                            >
                              {language.name}
                            </option>
                          ))}
                        </select>

                        <button
                          onClick={() => handleTranslate(comment)}
                          disabled={translatingId === comment._id}
                          className="hover:text-black disabled:opacity-50"
                        >
                          {translatingId === comment._id
                            ? "Translating..."
                            : "Translate"}
                        </button>

                        {user && comment.userid !== user._id && (
                          <button
                            onClick={() => handleReport(comment._id)}
                            className="hover:text-black"
                          >
                            Report
                          </button>
                        )}

                        {comment.userid === user?._id && (
                          <>
                            <button
                              onClick={() => handleEdit(comment)}
                              className="hover:text-black"
                            >
                              Edit
                            </button>

                            <button
                              onClick={() => handleDelete(comment._id)}
                              className="hover:text-black"
                            >
                              Delete
                            </button>
                          </>
                        )}
                      </div>

                      {comment.flaggedForReview && (
                        <p className="text-xs text-gray-500 mt-2">
                          This comment has been flagged for review.
                        </p>
                      )}
                    </>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Comments;