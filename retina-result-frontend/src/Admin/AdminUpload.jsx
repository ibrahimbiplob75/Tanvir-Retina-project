import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const AdminUpload = () => {
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (
      selectedFile &&
      (selectedFile.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        selectedFile.type === "application/vnd.ms-excel")
    ) {
      setFile(selectedFile);
      setUploadStatus(null);
    } else {
      setFile(null);
      setUploadStatus("Please select a valid Excel file.");
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setUploadStatus("No file selected.");
      return;
    }

    // Create a unique file name by appending a timestamp to the original name
    const uniqueFileName = `${Date.now()}_${file.name}`;

    const formData = new FormData();
    formData.append("file", file, uniqueFileName);

    try {
      await axios.post("http://localhost:5000/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setUploadStatus("File uploaded successfully!");
      Swal.fire({
        title: "Result File",
        text: "File uploaded successfully!",
        icon: "success",
      });
    } catch (error) {
      console.error(error);
      setUploadStatus("File upload failed.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="card w-full max-w-md shadow-lg bg-white">
        <div className="card-body">
          <h2 className="card-title text-center text-xl font-semibold">
            Admin - Upload Results
          </h2>
          <div className="form-control mt-4">
            <label className="label">
              <span className="label-text">
                Upload Excel File (.xlsx or .xls)
              </span>
            </label>
            <input
              type="file"
              accept=".xlsx, .xls"
              onChange={handleFileChange}
              className="input input-bordered w-full"
            />
          </div>
          <div className="card-actions mt-6">
            <button onClick={handleUpload} className="btn btn-primary w-full">
              Upload
            </button>
          </div>
          {uploadStatus && (
            <div className="mt-4 text-center text-sm font-semibold">
              <p
                className={
                  uploadStatus.includes("successfully")
                    ? "text-green-500"
                    : "text-red-500"
                }
              >
                {uploadStatus}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminUpload;
