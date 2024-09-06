import { useEffect, useState } from "react";
import { RiDeleteBin5Line } from "react-icons/ri";
import { TiEdit } from "react-icons/ti";
import { useNavigate } from "react-router-dom";
import MyVideos from "./MyVideos";
import Header from "./components/Header";
import Footer from "./components/Footer";

interface UserProfile {
  email: string;
  name: string;
}

export default function Profile() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("No token found. Please log in.");
      navigate("/login");
      return;
    }

    fetch("http://localhost:8082/api/auth/me", {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        if (response.status === 401) {
          setError("Unauthorized. Please log in.");
          navigate("/login");
        }
        alert("Please log in.");
        navigate("/login");
      })
      .then((data) => {
        setUserProfile(data);
        setName(data.name);
        setEmail(data.email);
      })
      .catch((error) => {
        setError(error.message);
      });
  }, [navigate]);

  const handleUpdate = () => {
    if (password && password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const updatedData = {
      name,
      email,
      password: password || undefined,
    };

    if (window.confirm("Are you sure you want to update your profile?")) {
      fetch("http://localhost:8082/api/auth/edit/me", {
        method: "PUT",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          }
          throw new Error("Failed to update profile.");
        })
        .then((data) => {
          setUserProfile(data);
          alert("Profile updated successfully.");
          setEditMode(false);
        })
        .catch((error) => {
          setError(error.message);
        });
    }
  };

  const handleDelete = () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete your account?"
    );

    if (!confirmDelete) {
      return;
    }

    fetch("http://localhost:8082/api/auth/delete/me", {
      method: "DELETE",
      credentials: "include",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => {
        if (response.ok) {
          localStorage.removeItem("token");
          navigate("/login");
        } else {
          throw new Error("Failed to delete account.");
        }
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  const handleLogout = async () => {
    const confirmLogout = window.confirm("Apakah Anda yakin ingin logout?");

    if (!confirmLogout) {
      return;
    }
    try {
      const response = await fetch("http://localhost:8082/api/auth/sign-out", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        localStorage.removeItem("authToken");
        document.cookie =
          "token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";

        alert("Berhasil Logout");
        navigate("/");
      } else {
        console.error("Gagal logout.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }
  if (!userProfile) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Header />
      <div className="container mx-auto py-8 px-28">
        <div className="p-4  text-gray-200 px-44">
          {!editMode ? (
            <>
              <div className="flex justify-between items-center mb-4">
                <div>
                  <p>
                    <strong>Name:</strong> {userProfile.name}
                  </p>
                  <p>
                    <strong>Email:</strong> {userProfile.email}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setEditMode(true)}
                    className="flex items-center text-white px-4 py-2 rounded-md hover:bg-custom-color hover:text-black"
                  >
                    <TiEdit className="mr-2 w-10 h-10" />
                    Edit
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex items-center text-white  px-4 py-2 rounded-md hover:bg-red-300 hover:text-black"
                  >
                    <RiDeleteBin5Line className="mr-2 w-10 h-10" />
                    Logout
                  </button>
                  <button
                    onClick={handleDelete}
                    className="flex items-center text-white px-4 py-2 rounded-md hover:bg-red-500 hover:text-black"
                  >
                    <RiDeleteBin5Line className="mr-2 w-10 h-10" />
                    Delete
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300">
                  Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 block w-full p-2 bg-gray-800 border border-gray-700 rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full p-2 bg-gray-800 border border-gray-700 rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300">
                  New Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 block w-full p-2 bg-gray-800 border border-gray-700 rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="mt-1 block w-full p-2 bg-gray-800 border border-gray-700 rounded-md"
                />
              </div>
              <div className="flex justify-between">
                <button
                  onClick={handleUpdate}
                  className="bg-custom-color text-black font-bold px-4 py-2 rounded-md hover:bg-blue-300"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setEditMode(false)}
                  className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
                >
                  Cancel
                </button>
              </div>
            </>
          )}
        </div>
        <MyVideos />
      </div>
      <Footer />
    </>
  );
}
