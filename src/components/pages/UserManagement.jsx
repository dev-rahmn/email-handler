import React, { useState, useEffect } from "react";
import { Edit2, Trash2 } from "lucide-react";

// Dummy fetch functions (replace with real API calls)
const fetchUsers = async () => [
  {
    id: 1,
    name: "Alice",
    email: "alice@example.com",
    role: "Admin",
    status: "Active",
  },
  {
    id: 2,
    name: "Bob",
    email: "bob@example.com",
    role: "User",
    status: "Inactive",
  },
];
const fetchLogs = async () => [
  { id: 1, timestamp: "2025-04-21 10:32", action: "Created user Alice" },
  { id: 2, timestamp: "2025-04-21 11:15", action: "Deleted user Bob" },
];

const UserManagement = () => {
  const [tab, setTab] = useState("users");
  const [users, setUsers] = useState([]);
  const [logs, setLogs] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingUser, setDeletingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    status: "Active",
    password: "",
  });

  useEffect(() => {
    (async () => {
      setUsers(await fetchUsers());
      setLogs(await fetchLogs());
    })();
  }, []);

  const openCreate = () => {
    setEditingUser(null);
    setFormData({ name: "", email: "", status: "Active", password: "" });
    setModalOpen(true);
  };
  const openEdit = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      status: user.status,
      password: "",
    });
    setModalOpen(true);
  };
  const openDelete = (user) => {
    setDeletingUser(user);
    setDeleteModalOpen(true);
  };
  const handleDelete = () => {
    if (!deletingUser) return;
    setUsers((prev) => prev.filter((u) => u.id !== deletingUser.id));
    setLogs((prev) => [
      {
        id: prev.length + 1,
        timestamp: new Date().toISOString(),
        action: `Deleted user ${deletingUser.name}`,
      },
      ...prev,
    ]);
    setDeleteModalOpen(false);
    setDeletingUser(null);
  };
  const handleSave = () => {
    if (editingUser) {
      setUsers((prev) =>
        prev.map((u) =>
          u.id === editingUser.id
            ? {
                ...u,
                name: formData.name,
                email: formData.email,
                status: formData.status,
              }
            : u
        )
      );
      setLogs((prev) => [
        {
          id: prev.length + 1,
          timestamp: new Date().toISOString(),
          action: `Updated user ${formData.name}`,
        },
        ...prev,
      ]);
    } else {
      const newUser = { id: Date.now(), ...formData, role: "User" };
      setUsers((prev) => [newUser, ...prev]);
      setLogs((prev) => [
        {
          id: prev.length + 1,
          timestamp: new Date().toISOString(),
          action: `Created user ${formData.name}`,
        },
        ...prev,
      ]);
    }
    setModalOpen(false);
  };

  return (
    <div className="px-4 pt-20 pb-16">
      {/* Header */}
      <h1 className="text-2xl font-bold mb-4 text-black">
        Admin Panel - User Management
      </h1>

      {/* Tabs + Add User */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-4">
          <button
            className={`px-4 py-2 rounded ${
              tab === "users"
                ? "bg-darkGrey text-white shadow-inner shadow-cyan"
                : "text-black bg-ultraLightGreen border border-darkGrey hover:bg-darkGrey hover:text-white shadow-inner shadow-orange"
            }`}
            onClick={() => setTab("users")}
          >
            Uses
          </button>
          <button
            className={`px-4 py-1 rounded-md ${
              tab === "logs"
                ? "bg-darkGrey text-white shadow-inner shadow-cyan"
                : "text-black bg-ultraLightGreen border border-darkGrey hover:bg-darkGrey hover:text-white shadow-inner shadow-orange"
            }`}
            onClick={() => setTab("logs")}
          >
            Logs
          </button>
        </div>
        {tab === "users" && (
          <button
            className="bg-darkGrey text-white shadow-inner shadow-lightOrange px-4 py-2 rounded hover:bg-lightCyan hover:text-black transition"
            onClick={openCreate}
          >
            + Add User
          </button>
        )}
      </div>

      {/* Users Table */}
      {tab === "users" && (
        <div className="overflow-x-auto bg-ultraLightGreen rounded-lg shadow-lg">
          <table className="min-w-full bg-transparent">
            <thead>
              <tr className="bg-lightCyan">
                {["Name", "Email", "Role", "Status", "Actions"].map((hdr) => (
                  <th
                    key={hdr}
                    className="py-3 px-6 text-left text-sm font-semibold text-black border-y border-black uppercase"
                  >
                    {hdr}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-lightGrey bg-white"
                >
                  <td className="py-2 px-6 text-black font-medium">
                    {user.name}
                  </td>
                  <td className="py-2 px-6 text-black">{user.email}</td>
                  <td className="py-2 px-6 text-black">{user.role}</td>
                  <td className="py-2 px-6">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded ${
                        user.status === "Active"
                          ? "bg-lightGreen text-white"
                          : "bg-red text-black"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="py-2 px-6 space-x-2 flex">
                    <button
                      className="bg-lightBlue text-white px-3 py-1 rounded-lg hover:bg-darkBlue transition-transform transform hover:scale-105"
                      onClick={() => openEdit(user)}
                    >
                      <Edit2 className="inline-block lg:hidden w-4 h-4" />
                      <span className="hidden lg:inline">Edit</span>
                    </button>
                    <button
                      className="bg-red text-white px-3 py-1 rounded-lg hover:bg-darkGrey transition-transform transform hover:scale-105"
                      onClick={() => openDelete(user)}
                    >
                      <Trash2 className="inline-block lg:hidden w-4 h-4" />
                      <span className="hidden lg:inline">Delete</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Activity Logs */}
      {tab === "logs" && (
        <div className="shadow  p-4 bg-white w-[50%] min-h-[70vh] max-h-[75vh] rounded-lg border  overflow-y-auto">
          <h2 className="text-2xl font-bold mb-3 text-black">
            Activity Logs
          </h2>
          <ul className="space-y-2">
            {logs.map((log) => (
              <li key={log.id} className="text-white p-3 bg-lightGrey rounded-md">
                <span className="font-medium text-red">
                  {log.timestamp}:
                </span>{" "}
                {log.action}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Create / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="rounded-lg w-96 p-6 bg-white">
            <h3 className="text-lg font-semibold mb-4 text-black">
              {editingUser ? "Edit User" : "Create User"}
            </h3>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Name"
                className="w-full border border-lightGrey px-3 py-2 rounded text-brown"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
              <input
                type="email"
                placeholder="Email"
                className="w-full border border-lightGrey px-3 py-2 rounded text-brown"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
              {!editingUser && (
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full border border-lightGrey px-3 py-2 rounded text-brown"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
              )}

              <select
                className="w-full border border-lightGrey px-3 py-2 rounded text-brown"
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                className="px-4 py-1 rounded bg-red  text-white"
                onClick={() => setModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-1 rounded bg-green text-white hover:bg-lightGreen"
                onClick={handleSave}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="rounded-lg w-[480px] p-6 bg-white">
            <h3 className="text-lg font-semibold mb-4 text-black">
              Confirm Delete
            </h3>
            <p className="text-grey mb-6">
              Are you sure you want to delete{" "}
              <span className="font-medium text-darkBrown">
                {deletingUser?.name}
              </span>
              ?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                className="px-4 py-2 rounded-3xl bg-grey hover:bg-darkGrey text-white"
                onClick={() => setDeleteModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded-3xl bg-red text-white hover:bg-darkGrey"
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
