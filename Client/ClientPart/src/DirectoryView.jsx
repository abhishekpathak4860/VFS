import { useEffect, useState, useRef } from "react";
import axios from "axios";
import "./App.css";
import List from "./Components/List";
import { useParams, Link } from "react-router-dom";

function DirectoryView() {
  const url = "http://localhost:5000";

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

  const { "*": dirPath } = useParams();

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
    // xhr.setRequestHeader("filename", selectedFile.name);
    xhr.setRequestHeader("parentdirid", parentDirectoryId);
    xhr.addEventListener("load", () => {
      console.log(xhr.response);
      fetchDirectory(CurrentPath); // again render the data on UI
    });

    xhr.upload.addEventListener("progress", (e) => {
      const totalProgress = (e.loaded / e.total).toFixed(2) * 100;
      setFileProgress(totalProgress);
    });
    xhr.send(selectedFile);
  };
  // folder upload
  const HandlefolderUpload = async () => {
    if (!folderName) {
      return setChooseFolderError(false);
    }
    // const xhr = new XMLHttpRequest();
    // xhr.open("POST", `${url}/folder/upload/${folderName}`, true);
    // xhr.setRequestHeader("parentdirid", parentDirectoryId);

    // xhr.addEventListener("load", () => {
    //   setFolderProgress(JSON.parse(xhr.responseText));
    //   setFolderName("");
    //   fetchDirectory(CurrentPath); // again render the data on UI
    // });

    // xhr.upload.addEventListener("progress", (e) => {
    //   const totalProgress = (e.loaded / e.total).toFixed(2) * 100;
    //   setFolderProgress(totalProgress);
    // });
    // xhr.send(folderName);
    try {
      const res = await axios.post(
        `${url}/folder/upload/${folderName}`,
        {}, // no body required
        {
          headers: {
            parentdirid: parentDirectoryId,
          },
        }
      );
      // Update UI
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

  const fetchDirectory = (path) => {
    axios
      .get(`${url}${path}/${dirPath}`)
      .then((response) => {
        setParentDirectoryId(response.data.id);
        setDirectoryList(response.data.folder || []);
        setFileList(response.data.files || []);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };
  // delete file
  const handleDelete = async (filename) => {
    const response = await fetch(`${url}/file/${filename}`, {
      method: "DELETE",
    });
    const data = await response.text();

    alert(data);
    fetchDirectory(CurrentPath); // again render the data on UI
  };
  // delete folder
  const handleDeleteFolderConfirmation = async (folder) => {
    setIsDeleteModalOpen(true);
    setCurrentFolderName(folder.name);
    setFolderIdToDelete(folder.id);
  };
  const CancelDeleteFolder = async () => {
    setIsDeleteModalOpen(false);
    setFolderIdToDelete(null);
  };
  const handleDeleteFolder = async () => {
    const response = await fetch(`${url}/directory/${folderIdToDelete}`, {
      method: "DELETE",
      headers: {
        parentdirid: parentDirectoryId,
      },
    });
    const data = await response.json();
    setIsDeleteModalOpen(false);
    setFolderIdToDelete(null);
    fetchDirectory(CurrentPath); // again render the data on UI
  };

  // rename folder
  const handleOldFolderName = (folder) => {
    setRename(folder.name);
    setEditingFolderId(folder.id);
  };
  const handleFolderUpdate = async (newFolderName, folderId) => {
    try {
      const res = await axios.patch(`${url}/directory/${folderId}`, {
        newFolderName,
      });
      setEditingFolderId(null);
      fetchDirectory(CurrentPath);
    } catch (error) {
      console.error(error);
    }
  };
  // derive breadcrumb from dirPath
  const breadcrumb = dirPath ? dirPath.split("/") : [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 flex items-center justify-center bg-blue-600 rounded-md text-white font-bold">
                VFS
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-semibold text-gray-800">
                  Virtual File System
                </h1>
                <p className="text-xs text-gray-500">
                  Manage your files and folders
                </p>
              </div>
            </div>

            {/* search */}
            <div className="ml-6 hidden md:flex items-center bg-gray-100 rounded-lg px-3 py-2 gap-2 w-96">
              <svg
                className="w-5 h-5 text-gray-400"
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
                className="bg-transparent outline-none text-sm w-full"
                placeholder="Search files and folders..."
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-600 hidden sm:block">
              pathak12@gmail.com
            </div>
            <button className="px-3 py-2 bg-white border rounded hover:shadow">
              Account
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        {/* modal kept as-is when open */}
        {isDeleteModalOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center"
            aria-hidden={!isDeleteModalOpen}
          >
            <div
              className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm transition-opacity"
              aria-hidden
            />
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="delete-folder-title"
              className="relative bg-white w-[90%] sm:w-[420px] rounded-2xl shadow-2xl p-6 text-center animate-fade-in"
            >
              <h2
                id="delete-folder-title"
                className="text-xl font-semibold text-gray-800 mb-3"
              >
                Delete Folder
              </h2>
              <p className="text-sm text-gray-600 mb-6">
                Are you sure you want to delete{" "}
                <span className="font-medium text-gray-800">
                  {currentFolderName}
                </span>
                ? <br />
                <span className="font-medium text-red-500">
                  This action cannot be undone.
                </span>
              </p>
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={handleDeleteFolder}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                >
                  Delete
                </button>
                <button
                  onClick={CancelDeleteFolder}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Breadcrumb + stats */}
        <div className="flex items-center justify-between mb-6">
          <nav className="text-sm text-gray-600">
            <Link to="/" className="text-blue-600 hover:underline">
              Home
            </Link>
            <span className="mx-2 text-gray-400">/</span>
            <span className="font-medium">{dirPath || "Root"}</span>
          </nav>

          <div className="text-sm text-gray-600">
            {directoryList.length} folders • {fileList.length} files
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar folders */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-4 sticky top-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Folders</h3>
                <div className="text-sm text-gray-500">
                  {directoryList.length}
                </div>
              </div>

              <div className="space-y-2">
                {directoryList.length === 0 && (
                  <div className="text-sm text-gray-500">No folders</div>
                )}
                {directoryList.map((dir) => (
                  <div
                    key={dir.id}
                    className="flex items-center justify-between p-2 rounded hover:bg-gray-50 transition"
                  >
                    <Link
                      to={`./${dir.id}`}
                      className="flex items-center gap-3 flex-1"
                    >
                      <div className="w-9 h-9 flex items-center justify-center bg-yellow-100 text-yellow-600 rounded">
                        <svg
                          className="w-5 h-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M2 6a2 2 0 012-2h3l2 2h5a2 2 0 012 2v8H2V6z" />
                        </svg>
                      </div>
                      <div className="truncate">{dir.name}</div>
                    </Link>
                    <div className="flex items-center gap-2 ml-2">
                      <button
                        onClick={() => handleOldFolderName(dir)}
                        className="p-1 rounded hover:bg-blue-50 transition"
                        title="Rename Folder"
                      >
                        <svg
                          className="w-5 h-5 text-blue-600"
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
                        className="p-1 rounded hover:bg-red-50"
                      >
                        <svg
                          className="w-5 h-5 text-red-500"
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
                  <label className="text-sm text-gray-600">Rename folder</label>
                  <div className="flex gap-2 mt-2">
                    <input
                      className="flex-1 px-3 py-2 border rounded"
                      value={rename || ""}
                      onChange={(e) => setRename(e.target.value)}
                    />
                    <button
                      onClick={() =>
                        handleFolderUpdate(rename, editingFolderId)
                      }
                      className="px-3 py-2 bg-blue-600 text-white rounded"
                    >
                      Save
                    </button>
                  </div>
                </div>
              )}
            </div>
          </aside>

          {/* Main area */}
          <section className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow p-4 mb-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <label className="text-sm text-gray-700">Upload file</label>
                  <input
                    type="file"
                    onChange={HandleFileSelect}
                    className="hidden"
                    id="file-upload-input"
                  />
                  <label
                    htmlFor="file-upload-input"
                    className="px-4 py-2 bg-blue-600 text-white rounded cursor-pointer"
                  >
                    Choose file
                  </label>
                  <div className="text-sm text-gray-500">
                    {selectedFile ? selectedFile.name : "No file chosen"}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={HandleUpload}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Upload
                  </button>
                  <div className="w-56 bg-gray-100 rounded overflow-hidden">
                    <div
                      className="h-2 bg-green-500"
                      style={{ width: `${FileProgress}%` }}
                    />
                  </div>
                  <div className="text-sm text-gray-600 w-12 text-right">
                    {FileProgress}%
                  </div>
                </div>
              </div>

              <div className="mt-4 border-t pt-4">
                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    placeholder="Enter folder name"
                    value={folderName}
                    className="px-3 py-2 border rounded w-64"
                    onChange={(e) => setFolderName(e.target.value)}
                  />
                  <button
                    onClick={HandlefolderUpload}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Create Folder
                  </button>
                </div>
                {!ChooseFolderError && (
                  <p className="text-red-500 mt-2 text-sm">
                    Please enter folder name
                  </p>
                )}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Files</h3>
                <div className="text-sm text-gray-500">
                  {fileList.length} items
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {fileList.length === 0 && (
                  <div className="text-gray-500">No files found</div>
                )}
                {fileList.map(({ name, id, type }) => (
                  <List
                    data={name}
                    id={id}
                    type={type}
                    key={id}
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
