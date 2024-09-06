import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import { FaTrash } from "react-icons/fa";
import HeaderAdmin from "./HeaderAdmin";
import { FcSearch } from "react-icons/fc";

export interface UserWithVideoCount {
  id: number;
  name: string;
  email: string;
  videoCount: number;
}

export default function HomeAdmin() {
  const [users, setUsers] = useState<UserWithVideoCount[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:8082/api/auth/countall")
      .then((response) => response.json())
      .then((data) => setUsers(data))
      .catch((error) => console.error("Error fetching users:", error));
  }, []);

  const handleDelete = (id: number) => {
    console.log("Attempting to delete user with id:", id);
    const confirmed = window.confirm(
      "Apakah Anda yakin ingin menghapus pengguna ini?"
    );

    if (confirmed) {
      fetch(`http://localhost:8082/api/auth/delete/${id}`, {
        method: "DELETE",
      })
        .then((response) => {
          if (response.ok) {
            setUsers(users.filter((user) => user.id !== id));
          } else {
            console.error("Error deleting user");
          }
        })
        .catch((error) => console.error("Error:", error));
    }
  };

  const handleUserClick = (id: number) => {
    navigate(`/user-profile/${id}`);
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortUsers = (users: UserWithVideoCount[]) => {
    return [...users].sort((a, b) => {
      return sortOrder === "asc"
        ? a.videoCount - b.videoCount
        : b.videoCount - a.videoCount;
    });
  };

  const sortedUsers = sortUsers(filteredUsers);

  return (
    <>
      <HeaderAdmin />
      <div className="relative flex flex-col min-h-screen">
        <main className="flex-grow flex flex-col items-center pt-8">
          <div className="text-white mt-10">
            <h3 className="text-2xl font-bold mb-4">
              Total Akun: {sortedUsers.length}
            </h3>
            <div className="sticky top-28 h-12 z-30 flex-grow flex justify-center mb-10">
              <FcSearch className="w-16 h-12 text-custom-color" />
              <input
                type="text"
                className="p-2 rounded-md bg-gray-700 text-white w-full max-w-xs md:max-w-md"
                placeholder="Search videos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="ml-4">
                <label className="text-sm mr-2">Sort by:</label>
                <select
                  value={sortOrder}
                  onChange={(e) =>
                    setSortOrder(e.target.value as "asc" | "desc")
                  }
                  className="p-2 bg-gray-700 text-white rounded"
                >
                  <option value="asc">Video Tersedikit</option>
                  <option value="desc">Video Terbanyak</option>
                </select>
              </div>
            </div>
            <div className="overflow-x-auto w-full">
              <table className="min-w-full bg-gray-800">
                <thead>
                  <tr>
                    <th className="py-2 px-4 text-left text-white">Name</th>
                    <th className="py-2 px-4 text-left text-white">Email</th>
                    <th className="py-2 px-4 text-left text-white">
                      Video Count
                    </th>
                    <th className="py-2 px-4 text-left text-white">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedUsers.map((user) => {
                    if (!user || !user.id) {
                      console.warn(
                        "User data is missing `id` or `user` is undefined",
                        user
                      );
                      return null;
                    }

                    return (
                      <tr key={user.id} className="bg-gray-700">
                        <td className="py-2 px-4">
                          <button
                            onClick={() => handleUserClick(user.id)}
                            className="text-custom-color hover:text-blue-400"
                          >
                            {user.name}
                          </button>
                        </td>
                        <td className="py-2 px-4">
                          <button
                            onClick={() => handleUserClick(user.id)}
                            className="text-custom-color hover:text-blue-400"
                          >
                            {user.email}
                          </button>
                        </td>
                        <td className="py-2 px-4">
                          <button
                            onClick={() => handleUserClick(user.id)}
                            className="text-custom-color hover:text-blue-400"
                          >
                            {user.videoCount}
                          </button>
                        </td>
                        <td className="py-2 px-4">
                          <button
                            onClick={() => handleDelete(user.id)}
                            className="text-custom-color hover:text-red-500"
                          >
                            <FaTrash className="w-6 h-6" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}
