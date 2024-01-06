import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { getAllUsers } from "../../../../../../Service/Api";
import SkeletonRow from "../Product/SkeletonRow";

const ListCustomer = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllUsers();
 
        const filteredUsers = data.data.filter((user) => user.role !== "admin");
        setUserData(filteredUsers);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleEditPassword = (userId) => {
    console.log(`Edit password for user with ID: ${userId}`);
  };

  const handleDeleteUser = (userId) => {
    console.log(`Delete user with ID: ${userId}`);
  };

  return (
    <div className="px-12 p-8">
      <h1 className="text-2xl font-bold mb-4">List Customer</h1>
      {loading ? (
        <SkeletonRow />
      ) : (
        <>
          {userData && userData.length > 0 ? (
            <table className="min-w-full border border-gray-300">
              <thead>
                <tr>
                  <th className="border px-4 py-2">User ID</th>
                  <th className="border px-4 py-2">Username</th>
                  <th className="border px-4 py-2">Email</th>
                  <th className="border px-4 py-2">Role</th>
                  <th className="border px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {userData.map((user) => (
                  <tr key={user.id}>
                    <td className="border px-4 py-2">{user.uid}</td>
                    <td className="border px-4 py-2">{user.username}</td>
                    <td className="border px-4 py-2">{user.email}</td>
                    <td className="border px-4 py-2">{user.role}</td>
                    <td className="border px-4 py-2 space-x-2">
                      <button
                        className="bg-blue-500 text-white px-2 py-1 rounded"
                        onClick={() => handleEditPassword(user.id)}
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="bg-red-500 text-white px-2 py-1 rounded"
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>Tidak ada pelanggan.</p>
          )}
        </>
      )}
    </div>
  );
};

export default ListCustomer;
