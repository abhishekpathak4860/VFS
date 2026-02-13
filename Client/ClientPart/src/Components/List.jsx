import axios from "axios";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";

export default function List({
  data,
  id,
  type,
  Delete,
  fetchDirectory,
  CurrentPath,
}) {
  const [rename, setRename] = useState("");
  const { "*": dirPath } = useParams();

  async function renameFile(oldfilename) {
    setRename(oldfilename);
  }
  // async function savefilename(oldfilename, newfilename) {
  //   try {
  //     const response = await fetch(`http://localhost:5000/file/${id}`, {
  //       method: "PATCH",
  //       body: JSON.stringify({ oldfilename, newfilename }),
  //       headers: { "Content-Type": "application/json" },
  //     });
  //     const data = await response.json();
  //     console.log(data);
  //     if (data) {
  //       fetchDirectory(CurrentPath);
  //     } // again render the data on UI
  //     setRename("");
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }
  async function savefilename(oldfilename, newfilename) {
    try {
      const res = await axios.patch(
        `http://localhost:5000/file/${id}`,
        {
          oldfilename,
          newfilename,
        },
        {
          withCredentials: true, // ✅ added
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      console.log(res.data);

      if (res.data) {
        fetchDirectory(CurrentPath); // re-render UI
      }

      setRename("");
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="bg-gray-50 border rounded p-4 shadow-sm flex flex-col">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 flex items-center justify-center bg-white rounded">
          <svg
            className="w-6 h-6 text-gray-600"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M8 2a2 2 0 00-2 2v1H3a1 1 0 00-1 1v10a2 2 0 002 2h10a2 2 0 002-2V6a1 1 0 00-1-1h-3V4a2 2 0 00-2-2H8z" />
          </svg>
        </div>
        <div className="flex-1">
          <div className="font-medium text-gray-800 truncate">{data}</div>
          <div className="text-xs text-gray-500 mt-1">{type || "file"}</div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {type !== "file" && (
          <Link
            to={`./${id}`}
            className="text-sm text-blue-600 hover:underline px-2 py-1"
          >
            Open
          </Link>
        )}

        <a
          href={`http://localhost:5000/file/${id}?action=open`}
          className="text-sm text-blue-600 hover:underline px-2 py-1"
        >
          Open
        </a>
        <a
          href={`http://localhost:5000/file/${id}?action=download`}
          className="text-sm text-blue-600 hover:underline px-2 py-1"
        >
          Download
        </a>

        <button
          className="text-sm px-2 py-1 bg-yellow-100 rounded"
          onClick={() => renameFile(data)}
        >
          Rename
        </button>
        <button
          className="text-sm px-2 py-1 bg-red-100 rounded"
          onClick={() => Delete(id)}
        >
          Delete
        </button>
      </div>

      <div className="mt-3 flex gap-2 items-center">
        <input
          type="text"
          className="flex-1 px-2 py-1 border rounded"
          onChange={(e) => setRename(e.target.value)}
          value={rename}
          placeholder="New name"
        />
        <button
          className="px-3 py-1 bg-blue-600 text-white rounded"
          onClick={() => savefilename(data, rename)}
        >
          Save
        </button>
      </div>
    </div>
  );
}
