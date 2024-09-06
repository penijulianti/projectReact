import { useEffect, useState } from "react";
import { FcSearch } from "react-icons/fc";

export interface Video {
  id: number;
  judul: string;
  description: string;
  video: string;
  tanggalUpload: string;
}

export interface Comment {
  id: number;
  komentar: string;
  namaPengguna: string;
  tanggalKomentar: string;
}

export default function ListVideo() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState<string>("");
  const [userToken, setUserToken] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");

  useEffect(() => {
    fetch("http://localhost:8082/api/videos")
      .then((response) => response.json())
      .then((data) => {
        sortVideos(data);
      })
      .catch((error) => console.error("Error fetching videos:", error));

    const token = localStorage.getItem("token");
    setUserToken(token);
  }, []);

  useEffect(() => {
    if (selectedVideo) {
      fetch(`http://localhost:8082/api/comments/by-video/${selectedVideo.id}`)
        .then((response) => response.json())
        .then((data) => {
          sortComments(data);
          setComments(data);
        })
        .catch((error) => console.error("Error fetching comments:", error));
    }
  }, [selectedVideo, sortOrder]);

  const handleVideoClick = (video: Video) => {
    setSelectedVideo(video);
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!userToken) {
      alert("You must be logged in to add a comment.");
      return;
    }

    fetch("http://localhost:8082/api/comments/add", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        videoId: `${selectedVideo?.id}`,
        komentar: newComment,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setComments((prevComments) => {
          const updatedComments = [...prevComments, data];
          sortComments(updatedComments);
          return updatedComments;
        });
        setNewComment(""); // Reset input komentar
      })
      .catch((error) => console.error("Error adding comment:", error));
  };

  const filteredVideos = videos.filter(
    (video) =>
      video.judul.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortVideos = (videos: Video[]) => {
    const sortedVideos = [...videos].sort((a, b) => {
      const dateA = new Date(a.tanggalUpload).getTime();
      const dateB = new Date(b.tanggalUpload).getTime();
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });
    setVideos(sortedVideos);
  };

  const sortComments = (comments: Comment[]) => {
    const sortedComments = [...comments].sort((a, b) => {
      const dateA = new Date(a.tanggalKomentar).getTime();
      const dateB = new Date(b.tanggalKomentar).getTime();
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });
    setComments(sortedComments);
  };

  return (
    <div className="relative flex flex-col min-h-screen">
      <main className="flex-grow container mx-auto py-10 relative z-20 px-16">
        <div className="sticky top-28 z-30 flex-grow flex justify-center mb-10">
          <FcSearch className="w-16 h-12 text-custom-color" />
          <input
            type="text"
            className="p-2 rounded-md bg-gray-700 text-white w-full max-w-xs md:max-w-md"
            placeholder="Search videos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="ml-4">
            <label htmlFor="sortOrder" className="text-sm mr-2">
              Sort by:
            </label>
            <select
              id="sortOrder"
              value={sortOrder}
              onChange={(e) =>
                setSortOrder(e.target.value as "newest" | "oldest")
              }
              className="text-black"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map((video) => (
            <div
              key={video.id}
              className="bg-slate-300 shadow-md rounded-lg overflow-hidden cursor-pointer"
              onClick={() => handleVideoClick(video)}
            >
              <video
                src={`/videos/${video.video}`}
                controls
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h2 className="text-xl text-slate-800 font-semibold">
                  {video.judul}
                </h2>
                <p className="text-slate-800">{video.description}</p>
              </div>
            </div>
          ))}
        </div>

        {selectedVideo && (
          <div className="fixed inset-0 h-full bg-black bg-opacity-75 z-40 flex flex-col items-center justify-center p-4 pt-32 pb-5">
            <button
              className="absolute top-4 right-4 md:right-8 lg:right-12 text-white text-2xl py-20"
              onClick={() => setSelectedVideo(null)}
              style={{ zIndex: 50 }}
            >
              &times;
            </button>

            <video
              src={`/videos/${selectedVideo.video}`}
              controls
              className="min-w-px h-80 object-cover mb-4"
            />
            <div className="w-3/4 max-w-xl  bg-slate-300 text-slate-800 p-4 rounded-lg shadow-lg overflow-y-auto h-full z-50">
              <h2 className="text-2xl font-semibold mb-2">
                {selectedVideo.judul}
              </h2>
              <p className="mb-4">{selectedVideo.description}</p>
              <label htmlFor="commentSortOrder" className="text-sm mr-2">
                Sort comments by:
              </label>
              <select
                id="commentSortOrder"
                value={sortOrder}
                onChange={(e) =>
                  setSortOrder(e.target.value as "newest" | "oldest")
                }
                className="text-slate-800 mb-4"
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
              </select>

              <div className="mb-4 h-64 overflow-y-scroll">
                {comments.length > 0 ? (
                  comments.map((comment) => (
                    <div key={comment.id} className="mb-2">
                      <p className="font-semibold text-red-500">
                        {comment.namaPengguna}
                      </p>
                      <p>{comment.komentar}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(comment.tanggalKomentar).toLocaleString()}
                      </p>
                    </div>
                  ))
                ) : (
                  <p>No comments yet.</p>
                )}
              </div>
              <form onSubmit={handleCommentSubmit} className="flex flex-col">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="mb-2 p-2 border rounded-md resize-none"
                />
                <button
                  type="submit"
                  className="bg-custom-color text-black font-bold p-2 rounded-md"
                >
                  Submit
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
