import { useEffect, useState, useRef } from "react";
import axios from "axios";
import "./App.css";
import List from "./Components/List";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchUser, logoutUser } from "./redux/userSlice";

function DirectoryView() {
  const url = import.meta.env.VITE_BACKEND_LOCAL_URL;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  const [parentDirectoryId, setParentDirectoryId] = useState();
  const [directoryList, setDirectoryList] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [folderName, setFolderName] = useState("");
  const [CurrentPath, setCurrentPath] = useState("/directory");
  const [ChooseFileError, setChooseFileError] = useState(true);
  const [ChooseFolderError, setChooseFolderError] = useState(true);
  const [FileProgress, setFileProgress] = useState(0);
  const [FolderProgress, setFolderProgress] = useState("");
  const [rename, setRename] = useState();
  const [editingFolderId, setEditingFolderId] = useState(null);
  const [folderIdToDelete, setFolderIdToDelete] = useState(null);

  const [currentFolderName, setCurrentFolderName] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // User Dropdown State & Ref
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const [rootId, setRootId] = useState(() => {
    return localStorage.getItem("rootId") || null;
  });
  const { "*": dirPath } = useParams();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Single Device Logout
  const handleLogout = async () => {
    setIsDropdownOpen(false);
    try {
      await axios.post(`${url}/logout`, {}, { withCredentials: true });
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      localStorage.removeItem("rootId");
      dispatch(logoutUser()); // clear redux state
      navigate("/login"); // redirect to login
    }
  };

  // Logout from All Devices (Dummy API placeholder)
  const handleLogoutAllDevices = async () => {
    setIsDropdownOpen(false);
    try {
      await axios.post(
        `${url}/logout-all-devices`,
        {},
        { withCredentials: true },
      );
    } catch (error) {
      console.error("Logout from all devices failed:", error);
    } finally {
      localStorage.removeItem("rootId");
      dispatch(logoutUser());
      navigate("/login");
    }
  };

  // Fetch user on mount
  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  const HandleFileSelect = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  // File Upload
  const HandleUpload = async () => {
    if (!selectedFile) {
      setChooseFileError(false);
      return;
    }
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${url}/file/${selectedFile.name}`, true);
    xhr.withCredentials = true;
    xhr.setRequestHeader("parentdirid", parentDirectoryId);
    xhr.addEventListener("load", () => {
      console.log(xhr.response);
      fetchDirectory(CurrentPath);
    });

    xhr.upload.addEventListener("progress", (e) => {
      const totalProgress = ((e.loaded / e.total) * 100).toFixed(0);
      setFileProgress(Number(totalProgress));
    });
    xhr.send(selectedFile);
  };

  // Folder Upload
  const HandlefolderUpload = async () => {
    if (!folderName) {
      return setChooseFolderError(false);
    }

    try {
      const res = await axios.post(
        `${url}/folder/upload/${folderName}`,
        {},
        {
          headers: {
            parentdirid: parentDirectoryId,
          },
          withCredentials: true,
        },
      );
      setFolderName("");
      setFolderProgress(res.data.message);
      fetchDirectory(CurrentPath);
    } catch (error) {
      console.log("Folder upload failed:", error);
    }
  };

  useEffect(() => {
    fetchDirectory(CurrentPath);
  }, [dirPath]);

  const fetchDirectory = async (path) => {
    try {
      const res = await axios.get(`${url}${path}/${dirPath}`, {
        withCredentials: true,
      });

      setParentDirectoryId(res.data?.id);
      setDirectoryList(res.data?.folders || []);
      setFileList(res.data?.files || []);
    } catch (error) {
      if (error.response?.status === 401) {
        navigate("/login");
      } else {
        console.error("Error fetching data:", error);
      }
    }
  };

  // Delete file
  const handleDelete = async (filename) => {
    try {
      const res = await axios.delete(`${url}/file/${filename}`, {
        withCredentials: true,
      });
      alert(res.data.message);
      fetchDirectory(CurrentPath);
    } catch (error) {
      console.error(error);
      alert("Error deleting file");
    }
  };

  // Delete folder confirmation
  const handleDeleteFolderConfirmation = async (folder) => {
    setIsDeleteModalOpen(true);
    setCurrentFolderName(folder.name);
    setFolderIdToDelete(folder._id);
  };

  const CancelDeleteFolder = async () => {
    setIsDeleteModalOpen(false);
    setFolderIdToDelete(null);
  };

  const handleDeleteFolder = async () => {
    try {
      await axios.delete(`${url}/directory/${folderIdToDelete}`, {
        headers: {
          parentdirid: parentDirectoryId,
        },
        withCredentials: true,
      });

      setIsDeleteModalOpen(false);
      setFolderIdToDelete(null);
      fetchDirectory(CurrentPath);
    } catch (error) {
      console.error(error);
    }
  };

  // Rename folder
  const handleOldFolderName = (folder) => {
    setRename(folder.name);
    setEditingFolderId(folder._id);
  };

  const handleFolderUpdate = async (newFolderName, folderId) => {
    try {
      await axios.patch(
        `${url}/directory/${folderId}`,
        { newFolderName },
        { withCredentials: true },
      );
      setEditingFolderId(null);
      fetchDirectory(CurrentPath);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 flex items-center justify-center bg-blue-600 rounded-lg text-white font-bold shadow-xs">
              VFS
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-gray-800 leading-tight">
                Virtual File System
              </h1>
              <p className="text-xs text-gray-500 hidden sm:block">
                Manage your files and folders seamlessly
              </p>
            </div>

            {/* Search Input */}
            <div className="ml-4 hidden lg:flex items-center bg-gray-100 border border-gray-200 rounded-lg px-3 py-1.5 gap-2 w-72 focus-within:ring-2 focus-within:ring-blue-500 focus-within:bg-white transition-all">
              <svg
                className="w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
                />
              </svg>
              <input
                className="bg-transparent outline-none text-xs w-full text-gray-700"
                placeholder="Search files and folders..."
              />
            </div>
          </div>

          {/* Right Header: User Icon & Dropdown Menu */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen((prev) => !prev)}
              className="flex items-center gap-2 p-1.5 rounded-full hover:bg-gray-100 border border-gray-200 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="User menu"
            >
              {/* User Icon Avatar */}
              <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
                {user?.email ? (
                  user.email.charAt(0).toUpperCase()
                ) : (
                  <svg
                    className="w-5 h-5 text-blue-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
              <svg
                className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                {/* User Email Info Section */}
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-xs text-gray-400 font-medium">
                    Signed in as
                  </p>
                  <p className="text-sm font-semibold text-gray-800 truncate">
                    {user ? user.email : "Guest User"}
                  </p>
                </div>

                {/* Navigation Links */}
                <div className="py-1">
                  <Link
                    to="/register"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-xs text-gray-700 hover:bg-gray-50 transition"
                  >
                    <svg
                      className="w-4 h-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                      />
                    </svg>
                    Register
                  </Link>

                  <Link
                    to="/login"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-xs text-gray-700 hover:bg-gray-50 transition"
                  >
                    <svg
                      className="w-4 h-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                      />
                    </svg>
                    Login
                  </Link>
                </div>

                {/* Logout Actions */}
                <div className="border-t border-gray-100 pt-1">
                  <button
                    onClick={handleLogout}
                    className="w-full text-left flex items-center gap-2.5 px-4 py-2 text-xs text-red-600 hover:bg-red-50 transition font-medium"
                  >
                    <svg
                      className="w-4 h-4 text-red-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                    Logout
                  </button>

                  <button
                    onClick={handleLogoutAllDevices}
                    className="w-full text-left flex items-center gap-2.5 px-4 py-2 text-xs text-red-600 hover:bg-red-50 transition font-medium"
                  >
                    <svg
                      className="w-4 h-4 text-red-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                    Logout from All Devices
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-4 sm:p-6">
        {/* Delete Modal */}
        {isDeleteModalOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            aria-hidden={!isDeleteModalOpen}
          >
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
              onClick={CancelDeleteFolder}
            />
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="delete-folder-title"
              className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 text-center z-10 animate-fade-in"
            >
              <h2
                id="delete-folder-title"
                className="text-xl font-semibold text-gray-800 mb-3"
              >
                Delete Folder
              </h2>
              <p className="text-sm text-gray-600 mb-6">
                Are you sure you want to delete{" "}
                <span className="font-semibold text-gray-800">
                  "{currentFolderName}"
                </span>
                ? <br />
                <span className="font-medium text-red-500">
                  This action cannot be undone.
                </span>
              </p>
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={handleDeleteFolder}
                  className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition shadow-xs"
                >
                  Delete
                </button>
                <button
                  onClick={CancelDeleteFolder}
                  className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Breadcrumb + stats */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-6">
          <nav className="text-sm text-gray-600 flex items-center gap-1">
            <Link
              to={`/${rootId}`}
              className="text-blue-600 hover:underline font-medium"
            >
              Home
            </Link>
            <span className="text-gray-400">/</span>
            <span className="font-semibold text-gray-800">
              {dirPath || "Root"}
            </span>
          </nav>

          <div className="text-xs sm:text-sm text-gray-500 bg-white px-3 py-1.5 rounded-md border shadow-xs">
            {directoryList.length} folders • {fileList.length} files
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar folders */}
          <aside className="lg:col-span-1">
            <div
              className="bg-white rounded-xl shadow-xs border p-4 sticky top-20 scrollable-sidebar"
              style={{
                maxHeight: "calc(100vh - 120px)",
                overflowY: "auto",
                WebkitOverflowScrolling: "touch",
              }}
            >
              <div className="flex items-center justify-between mb-4 pb-2 border-b">
                <h3 className="text-base font-semibold text-gray-800">
                  Folders
                </h3>
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium">
                  {directoryList.length}
                </span>
              </div>

              <div className="space-y-1">
                {directoryList.length === 0 && (
                  <div className="text-sm text-gray-400 py-2">
                    No folders here
                  </div>
                )}

                {directoryList.map((dir) => (
                  <div
                    key={dir._id}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition border border-transparent hover:border-gray-100"
                  >
                    <Link
                      to={`/${dir._id}`}
                      className="flex items-center gap-2.5 flex-1 min-w-0"
                    >
                      <div className="w-8 h-8 flex items-center justify-center bg-amber-50 text-amber-500 rounded-lg flex-shrink-0">
                        <svg
                          className="w-5 h-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M2 6a2 2 0 012-2h3l2 2h5a2 2 0 012 2v8H2V6z" />
                        </svg>
                      </div>
                      <div className="truncate text-sm text-gray-700 font-medium">
                        {dir.name}
                      </div>
                    </Link>
                    <div className="flex items-center gap-1 ml-2">
                      <button
                        onClick={() => handleOldFolderName(dir)}
                        className="p-1 rounded hover:bg-blue-50 transition text-blue-600"
                        title="Rename Folder"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15.232 5.232l3.536 3.536M4 20h4.586a1 1 0 00.707-.293l10.414-10.414a2 2 0 000-2.828l-1.464-1.464a2 2 0 00-2.828 0L5 15.414A1 1 0 004.586 16H4v4z"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDeleteFolderConfirmation(dir)}
                        className="p-1 rounded hover:bg-red-50 transition text-red-500"
                        title="Delete Folder"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 7h12M9 7V4h6v3m-7 4v7m4-7v7m4-7v7M4 7h16l-1 14H5L4 7z"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {editingFolderId && (
                <div className="mt-4 border-t pt-3">
                  <label className="text-xs text-gray-500 font-medium">
                    Rename folder
                  </label>
                  <div className="flex gap-2 mt-1.5">
                    <input
                      className="flex-1 px-2.5 py-1.5 text-xs border rounded-md focus:ring-1 focus:ring-blue-500 outline-none"
                      value={rename || ""}
                      onChange={(e) => setRename(e.target.value)}
                    />
                    <button
                      onClick={() =>
                        handleFolderUpdate(rename, editingFolderId)
                      }
                      className="px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-md hover:bg-blue-700 transition"
                    >
                      Save
                    </button>
                  </div>
                </div>
              )}
            </div>
          </aside>

          {/* Main Area */}
          <section className="lg:col-span-3">
            {/* Upload & Action Card */}
            <div className="bg-white rounded-xl shadow-xs border p-5 mb-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                {/* File Pick */}
                <div className="flex flex-wrap items-center gap-3">
                  <input
                    type="file"
                    onChange={HandleFileSelect}
                    className="hidden"
                    id="file-upload-input"
                  />
                  <label
                    htmlFor="file-upload-input"
                    className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200 text-xs font-semibold rounded-lg cursor-pointer transition"
                  >
                    Choose file
                  </label>
                  <span className="text-xs text-gray-500 max-w-xs truncate">
                    {selectedFile ? selectedFile.name : "No file selected"}
                  </span>
                </div>

                {/* File Upload Button & Progress Bar */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={HandleUpload}
                    className="px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 shadow-xs transition"
                  >
                    Upload
                  </button>
                  <div className="w-36 sm:w-48 bg-gray-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 transition-all duration-300"
                      style={{ width: `${FileProgress}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium text-gray-600 w-10 text-right">
                    {FileProgress}%
                  </span>
                </div>
              </div>

              {/* Create Folder Section */}
              <div className="mt-5 border-t pt-4">
                <div className="flex flex-wrap gap-2 items-center">
                  <input
                    type="text"
                    placeholder="Enter new folder name"
                    value={folderName}
                    className="px-3 py-2 border rounded-lg text-xs w-full sm:w-64 focus:ring-1 focus:ring-blue-500 outline-none"
                    onChange={(e) => setFolderName(e.target.value)}
                  />
                  <button
                    onClick={HandlefolderUpload}
                    className="px-4 py-2 bg-emerald-600 text-white text-xs font-semibold rounded-lg hover:bg-emerald-700 shadow-xs transition"
                  >
                    Create Folder
                  </button>
                </div>
                {!ChooseFolderError && (
                  <p className="text-red-500 mt-2 text-xs">
                    Please enter a folder name
                  </p>
                )}
              </div>
            </div>

            {/* Files List Card */}
            <div className="bg-white rounded-xl shadow-xs border p-5">
              <div className="flex items-center justify-between mb-4 pb-2 border-b">
                <h3 className="text-base font-semibold text-gray-800">Files</h3>
                <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-0.5 rounded-full font-medium">
                  {fileList.length} items
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {fileList.length === 0 && (
                  <div className="text-sm text-gray-400 col-span-full py-4 text-center">
                    No files found in this directory
                  </div>
                )}
                {fileList.map(({ name, _id, type }) => (
                  <List
                    data={name}
                    id={_id}
                    type={type}
                    key={_id}
                    Delete={handleDelete}
                    fetchDirectory={fetchDirectory}
                    CurrentPath={CurrentPath}
                  />
                ))}
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default DirectoryView;
