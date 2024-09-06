import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Footer from "../components/Footer";
import HeaderAdmin from "./HeaderAdmin";

export interface UserWithVideoCount {
  id: number;
  name: string;
  email: string;
  videoCount: number;
}

export interface Video {
  id: number;
  judul: string;
  description: string;
  video: string;
}

export default function UserProfile() {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<UserWithVideoCount | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);

  useEffect(() => {
    if (id) {
      // Fetch user details
      fetch(`http://localhost:8082/api/auth/user/${id}`)
        .then((response) => response.json())
        .then((data) => setUser(data))
        .catch((error) => console.error("Error fetching user:", error));

      // Fetch user videos
      fetch(`http://localhost:8082/api/videos/by/${id}`)
        .then((response) => response.json())
        .then((data) => setVideos(data))
        .catch((error) => console.error("Error fetching videos:", error));
    }
  }, [id]);

  if (!user) return <p>Loading...</p>;

  return (
    <>
      <HeaderAdmin />
      <div className="relative flex flex-col min-h-screen">
        <main className="flex-grow flex flex-col items-center pt-8">
          <div className="text-white mt-10">
            <h3 className="text-2xl font-bold mb-4">User Profile</h3>
            <div className="bg-gray-800 p-6 rounded">
              <p className="text-lg font-semibold">Name: {user.name}</p>
              <p className="text-lg font-semibold">Email: {user.email}</p>
              <p className="text-lg font-semibold">
                Video Count: {user.videoCount}
              </p>
            </div>
          </div>

          <div className="text-white mt-10">
            <h3 className="text-2xl font-bold mb-4">User Videos</h3>
            {videos.length > 0 ? (
              <div className="bg-gray-800 p-6 rounded">
                <ul>
                  {videos.map((video) => (
                    <li key={video.id} className="mb-4">
                      <h4 className="text-xl font-semibold">{video.judul}</h4>
                      <p>{video.description}</p>
                      <video controls className="mt-2 w-full">
                        <source
                          src={`/videos/${video.video}`}
                          type="video/mp4"
                        />
                        Your browser does not support the video tag.
                      </video>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p>No videos found.</p>
            )}
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}
