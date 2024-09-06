import { useEffect, useState } from "react";
import { FcSearch } from "react-icons/fc";
import { TiEdit } from "react-icons/ti";
import { RiDeleteBin5Line } from "react-icons/ri";
import { IoMdClose } from "react-icons/io";
import { RiVideoAddLine } from "react-icons/ri";

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

export default function MyVideos() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [showUploadForm, setShowUploadForm] = useState<boolean>(false);
  const [videoTitle, setVideoTitle] = useState<string>("");
  const [videoDescription, setVideoDescription] = useState<string>("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState<string>("");
  const [userToken, setUserToken] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [editMode, setEditMode] = useState<boolean>(false);
  const [editedVideo, setEditedVideo] = useState<Video | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setUserToken(token);

    if (token) {
      fetch("http://localhost:8082/api/videos/my-videos", {
        method: "GET",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          sortVideos(data);
        })
        .catch((error) => console.error("Error fetching videos:", error));
    } else {
      window.location.href = "/login";
    }
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

  const handleEditClick = (video: Video) => {
    setEditedVideo(video);
    setEditMode(true);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!userToken || !editedVideo) return;

    fetch(`http://localhost:8082/api/videos/edit/${editedVideo.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`,
      },
      body: JSON.stringify(editedVideo),
    })
      .then((response) => response.text())
      .then((message) => {
        console.log(message);
        setEditMode(false);
        setEditedVideo(null);
      })
      .catch((error) => console.error("Error editing video:", error));
  };

  const handleDelete = (videoId: number) => {
    if (!userToken) return;

    fetch(`http://localhost:8082/api/videos/delete-by/${videoId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    })
      .then((response) => response.text())
      .then((message) => {
        console.log(message);
      })
      .catch((error) => console.error("Error deleting video:", error));
  };

  const handleDeleteComment = (commentId: number) => {
    fetch(`http://localhost:8082/api/comments/delete-by/${commentId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    })
      .then((response) => response.text())
      .then((message) => {
        console.log(message);
        setComments((prevComments) =>
          prevComments.filter((comment) => comment.id !== commentId)
        );
      })
      .catch((error) => console.error("Error deleting comment:", error));
  };

  const handleDeleteAllComments = () => {
    if (!selectedVideo) return;

    fetch(
      `http://localhost:8082/api/comments/delete-by-video/${selectedVideo.id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      }
    )
      .then((response) => response.text())
      .then((message) => {
        console.log(message);
        setComments([]);
      })
      .catch((error) => console.error("Error deleting all comments:", error));
  };

  const filteredVideos = videos.filter(
    (video) =>
      video.judul.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredComments = comments.filter(
    (comment) => comment.id === selectedVideo?.id
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
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setVideoFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!videoFile) {
      alert("Silakan pilih file video.");
      return;
    }

    const formData = new FormData();
    formData.append("judul", videoTitle); // Judul video
    formData.append("description", videoDescription); // Deskripsi video
    formData.append("file", videoFile); // File video

    try {
      const response = await fetch("http://localhost:8082/api/videos/upload", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      if (response.ok) {
        alert("Video berhasil diunggah!");
        setVideoTitle("");
        setVideoDescription("");
        setVideoFile(null);
        setShowUploadForm(false);
      } else {
        const errorData = await response.json();
        alert(
          `Gagal mengunggah video: ${
            errorData.message || "Error tidak diketahui"
          }`
        );
      }
    } catch (error) {
      console.error("Error uploading video:", error);
      alert("Terjadi kesalahan saat mengunggah video.");
    }
  };

  const handleCloseForm = () => {
    setShowUploadForm(false);
    setVideoTitle("");
    setVideoDescription("");
    setVideoFile(null);
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
        <button
          onClick={() => setShowUploadForm(!showUploadForm)}
          className=" text-white px-4 py-2 rounded-md flex items-center"
        >
          <RiVideoAddLine className="text-custom-color w-12 h-16 mr-2" /> Tambah
          Video
        </button>
        <main className="flex-grow container mx-auto py-10 relative z-20 px-16">
          {showUploadForm && (
            <div className="mt-6 p-4 bg-gray-100 border border-gray-300 rounded-md shadow-md">
              <button
                onClick={handleCloseForm}
                className="absolute top-38 right-20 text-gray-500 hover:text-gray-700"
                aria-label="Tutup"
              >
                <IoMdClose className="w-6 h-6" />
              </button>
              <h2 className="text-2xl font-semibold mb-4 text-black">
                Unggah Video Baru
              </h2>
              <form onSubmit={handleUpload} className="flex flex-col">
                <label htmlFor="judul" className="text-sm text-black mb-1">
                  Judul Video
                </label>
                <input
                  id="judul"
                  type="text"
                  value={videoTitle}
                  onChange={(e) => setVideoTitle(e.target.value)}
                  className="text-black mb-4 p-2 rounded-md border border-gray-400"
                  required
                />

                <label
                  htmlFor="description"
                  className="text-black text-sm mb-1"
                >
                  Deskripsi
                </label>
                <textarea
                  id="description"
                  value={videoDescription}
                  onChange={(e) => setVideoDescription(e.target.value)}
                  className="text-black mb-4 p-2 rounded-md border border-gray-400"
                  rows={3}
                  required
                />

                <label htmlFor="video" className="text-black text-sm mb-1">
                  File Video
                </label>
                <input
                  id="video"
                  type="file"
                  accept="video/*"
                  onChange={handleFileChange}
                  className="text-black mb-4"
                  required
                />

                <button
                  type="submit"
                  className="bg-custom-color text-black px-4 py-2 rounded-md"
                >
                  Unggah
                </button>
              </form>
            </div>
          )}
        </main>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-black">
          {filteredVideos.map((video) => (
            <div
              key={video.id}
              className="bg-slate-200 shadow-md rounded-lg overflow-hidden cursor-pointer"
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
                <div className="flex justify-between items-center mt-4">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditClick(video)}
                      className="  px-4 py-2 rounded-md"
                    >
                      <TiEdit className="w-12 h-16 cursor-pointer" />
                      Edit
                    </button>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleDelete(video.id)}
                      className="px-4 py-2 rounded-md"
                    >
                      <RiDeleteBin5Line className="w-12 h-16 cursor-pointer" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {selectedVideo && (
          <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex flex-col items-center justify-center p-4 pt-36 pb-2">
            <button
              className="absolute top-4 right-4 md:right-8 lg:right-12 text-white text-2xl py-28"
              onClick={() => setSelectedVideo(null)}
              style={{ zIndex: 50 }}
            >
              &times;
            </button>
            <video
              src={`/videos/${selectedVideo.video}`}
              controls
              className="min-w-px h-96 object-cover mb-4"
            />
            <div className="w-3/4 max-w-xl bg-slate-200 text-slate-800 p-4 rounded-lg shadow-lg overflow-y-auto h-72 z-50">
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
                      <p className="font-semibold text-red-300">
                        {comment.namaPengguna}
                      </p>
                      <p>{comment.komentar}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(comment.tanggalKomentar).toLocaleString()}
                      </p>
                      <button
                        onClick={() => handleDeleteComment(comment.id)}
                        className="text-red-500"
                      >
                        Delete Comment
                      </button>
                    </div>
                  ))
                ) : (
                  <p>No comments yet.</p>
                )}
              </div>
              <button
                onClick={handleDeleteAllComments}
                className="mb-4 bg-red-300 text-white px-4 py-2 rounded-md"
              >
                Delete All Comments
              </button>
              <form onSubmit={handleCommentSubmit} className="flex flex-col">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="mb-2 p-2 rounded-md border border-slate-500"
                  rows={3}
                  maxLength={500}
                />
                <button
                  type="submit"
                  className="self-end bg-custom-color text-black font-bold px-4 py-2 rounded-md"
                >
                  Submit
                </button>
              </form>
            </div>
          </div>
        )}

        {editMode && editedVideo && (
          <div className="fixed inset-0 bg-black bg-opacity-75 z-40 flex flex-col items-center justify-center p-4">
            <div className="bg-slate-200 text-slate-800 p-4 rounded-lg shadow-lg">
              <h2 className="text-2xl font-semibold mb-4">Edit Video</h2>
              <form onSubmit={handleEditSubmit} className="flex flex-col">
                <button
                  className="self-end text-slate-800 text-xl"
                  onClick={() => setEditMode(false)}
                  type="button"
                >
                  &times;
                </button>
                <label htmlFor="judul" className="text-sm mb-1">
                  Judul
                </label>
                <input
                  id="judul"
                  type="text"
                  value={editedVideo.judul}
                  onChange={(e) =>
                    setEditedVideo({ ...editedVideo, judul: e.target.value })
                  }
                  className="mb-4 p-2 rounded-md border border-slate-500"
                />
                <label htmlFor="description" className="text-sm mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  value={editedVideo.description}
                  onChange={(e) =>
                    setEditedVideo({
                      ...editedVideo,
                      description: e.target.value,
                    })
                  }
                  className="mb-4 p-2 rounded-md border border-slate-500"
                  rows={3}
                />
                <button
                  type="submit"
                  className="self-end bg-custom-color text-black font-bold px-4 py-2 rounded-md"
                >
                  Save
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
