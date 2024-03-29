import React, { useEffect, useState } from "react";
import { FaEdit, FaEye, FaPlus, FaTrash } from "react-icons/fa";
import { deleteUser, getAllUsers } from "../../../../../../Service/Api";
import SkeletonRow from "../Product/SkeletonRow";
import ModalEditPassword from "./ModalEditPassword";
import { motion, AnimatePresence } from "framer-motion";
import { BeatLoader } from "react-spinners";
import { ToastContainer, toast } from "react-toastify";
import ModalCreatedDisc from "./ModalCreatedDisc";
import ModalViewDiscount from "./ModalViewDiscount";

const ListCustomer = () => {
  const [userData, setUserData] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedUsername, setSelectedUseUsername] = useState(null);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [visibleModal, setVisibleModal] = useState(false);
  const [visibleCreatedDisc, setVisibleCreatedDisc] = useState(false);
  const [visibleOpenDisc, setVisibleOpenDisc] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingDelete, setLoadingDelete] = useState(false);

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
    setSelectedUser(userId);
    setVisibleModal(true);
  };

  const handleCreateDisc = (userId, email, username) => {
    setVisibleCreatedDisc(true);
    setSelectedEmail(email);
    setSelectedUseUsername(username);
    setSelectedUser(userId);
  };

  const handleOpenDisc = (userId) => {
    setVisibleOpenDisc(true);
    setSelectedUser(userId);
  };

  const handleDeleteUser = (userId) => {
    setSelectedUser(userId);
    setShowDeleteConfirmation(true);
  };

  const confirmDelete = async () => {
    setLoadingDelete(true);
    try {
      await deleteUser(selectedUser);
      setLoadingDelete(false);
      const data = await getAllUsers();
      const filteredUsers = data.data.filter((user) => user.role !== "admin");
      setUserData(filteredUsers);
      toast.success("user berhasil dihapus");
    } catch (error) {
    } finally {
      setShowDeleteConfirmation(false);
      setLoadingDelete(false);
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirmation(false);
  };

  const onClose = () => {
    setVisibleModal(false);
    setVisibleOpenDisc(false);
    setVisibleCreatedDisc(false);
  };

  return (
    <div className="px-12 p-8 bg-slate-200 h-screen w-screen ">
      <h1 className="text-2xl font-bold mb-4">Daftar Pelanggan</h1>
      {loading ? (
        <>
          {Array.from({ length: 5 }).map((_, index) => (
            <SkeletonRow key={index} />
          ))}
        </>
      ) : (
        <>
          {userData && userData.length > 0 ? (
            <table className="min-w-full border border-black text-center">
              <thead>
                <tr className="bg-gray-800 text-white text-center">
                  <th className="border border-black px-4 py-2">User ID</th>
                  <th className="border border-black px-4 py-2">Username</th>
                  <th className="border  border-black px-4 py-2">Email</th>
                  <th className="border  border-black px-4 py-2">Role</th>
                  <th className="border border-black px-4 py-2">Actions</th>
                  <th className="border border-black px-4 py-2">
                    Voucher Discount
                  </th>
                </tr>
              </thead>
              <tbody>
                {userData.map((user) => (
                  <tr key={user.uid}>
                    <td className="border border-black  px-4 py-2">
                      {user.uid}
                    </td>
                    <td className="border border-black px-4 py-2">
                      {user.username}
                    </td>
                    <td className="border border-black px-4 py-2">
                      {user.email}
                    </td>
                    <td className="border border-black px-4 py-2">
                      {user.role}
                    </td>
                    <td className="border border-black px-4 py-2 space-x-2 flex justify-center">
                      <button
                        className="bg-blue-500 text-white px-2 py-1 rounded"
                        onClick={() => handleEditPassword(user.uid)}
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="bg-red-500 text-white px-2 py-1 rounded"
                        onClick={() => handleDeleteUser(user.uid)}
                      >
                        <FaTrash />
                      </button>
                    </td>

                    <td className="border border-black px-4 py-2 ">
                      <div className="flex justify-center gap-2">
                        <button
                          className="bg-blue-500 text-white px-2 py-1 rounded"
                          onClick={() =>
                            handleCreateDisc(
                              user.uid,
                              user.email,
                              user.username
                            )
                          }
                        >
                          <FaPlus />
                        </button>

                        <button
                          className="bg-blue-500 text-white px-2 py-1 rounded"
                          onClick={() => handleOpenDisc(user.username)}
                        >
                          <FaEye />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-black flex justify-center">Tidak ada pelanggan.</p>
          )}
        </>
      )}

      {visibleModal && (
        <ModalEditPassword select={selectedUser} onClose={onClose} />
      )}
      {visibleOpenDisc && (
        <ModalViewDiscount select={selectedUser} onClose={onClose} />
      )}
      {visibleCreatedDisc && (
        <>
          <ModalCreatedDisc
            select={selectedUser}
            email={selectedEmail}
            username={selectedUsername}
            onClose={onClose}
          />
        </>
      )}

      <AnimatePresence>
        {showDeleteConfirmation && (
          <motion.div
            className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white p-4 rounded-md"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <p className="mb-4">Apakah anda ingin menghapus user ini?</p>
              <div className="flex justify-center">
                <motion.button
                  className="bg-red-500 text-white px-4 py-2 rounded mr-2"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={loadingDelete ? null : confirmDelete}
                  disabled={loadingDelete}
                  style={{ pointerEvents: loadingDelete ? "none" : "auto" }}
                >
                  {loadingDelete ? (
                    <BeatLoader color="#ffffff" size={8} />
                  ) : (
                    "Lanjut"
                  )}
                </motion.button>
                <motion.button
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={cancelDelete}
                  disabled={loadingDelete}
                >
                  Batal
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <ToastContainer />
    </div>
  );
};

export default ListCustomer;
