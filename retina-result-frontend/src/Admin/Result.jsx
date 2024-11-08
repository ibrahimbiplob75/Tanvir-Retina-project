import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

const Result = () => {
  const [results, setResults] = useState([]);
  const [searchRoll, setSearchRoll] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 100;

  // Fetch data from the API
  const fetchResults = async () => {
    try {
      const response = await axios.get("http://localhost:5000/admin/results");
      setResults(response.data);
    } catch (error) {
      console.error("Error fetching results:", error);
    }
  };

  useEffect(() => {
    fetchResults();
  }, []);

  // Handle delete
  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`http://localhost:5000/admin/results/${id}`);
          setResults((prevResults) =>
            prevResults.filter((result) => result._id !== id)
          );
          Swal.fire({
            title: "Deleted!",
            text: "The result has been deleted.",
            icon: "success",
          });
        } catch (error) {
          console.error("Error deleting result:", error);
          Swal.fire({
            title: "Error!",
            text: "Failed to delete the result.",
            icon: "error",
          });
        }
      }
    });
  };

  // Filter and paginate results
  const filteredResults = results.filter((result) =>
    result.Roll.toString().includes(searchRoll)
  );

  const indexOfLastResult = currentPage * resultsPerPage;
  const indexOfFirstResult = indexOfLastResult - resultsPerPage;
  const currentResults = filteredResults.slice(
    indexOfFirstResult,
    indexOfLastResult
  );

  const totalPages = Math.ceil(filteredResults.length / resultsPerPage);

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Student Results</h1>
      <div className="mb-4 flex gap-2">
        <input
          type="text"
          className="input input-bordered"
          placeholder="Enter Roll to search"
          value={searchRoll}
          onChange={(e) => setSearchRoll(e.target.value)}
        />
      </div>

      {/* Results Table */}
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>Roll</th>
              <th>Name</th>
              <th>Batch</th>
              <th>Student</th>
              <th>Guardian</th>
              <th>Mark</th>
              <th>D</th>
              <th>Neg_mark</th>
              <th>Position</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentResults.map((result) => (
              <tr key={result?._id}>
                <td>{result.Roll}</td>
                <td>{result.Name}</td>
                <td>{result.Batch}</td>
                <td>{result.Student}</td>
                <td>{result.Guardian}</td>
                <td>{result.Mark}</td>
                <td>{result.D}</td>
                <td>{result.Neg_mark}</td>
                <td>{result.Position}</td>
                <td>
                  <Link
                    to={`/admin/results/edit/${result?._id}`}
                    className="btn btn-sm btn-warning mr-2"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(result._id)}
                    className="btn btn-sm btn-error"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={goToPreviousPage}
          className="btn btn-sm"
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={goToNextPage}
          className="btn btn-sm"
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Result;
