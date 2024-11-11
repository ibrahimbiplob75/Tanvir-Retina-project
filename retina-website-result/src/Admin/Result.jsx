import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

const Result = () => {
  const [results, setResults] = useState([]);
  const [searchRoll, setSearchRoll] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const resultsPerPage = 100;


  const fetchResults = async (page) => {
    setLoading(true);
    try {
      const response = await axios.get(`https://retina-result-server.vercel.app/admin/results`, {
        params: { page, limit: resultsPerPage },
        withCredentials: true,
      });
      setResults(response?.data?.results); // assuming API returns paginated results under `results`
      setTotalPages(response?.data?.totalPages); // assuming API returns total pages
    } catch (error) {
      console.error("Error fetching results:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults(currentPage);
  }, [currentPage]);

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
      if (result?.isConfirmed) {
        try {
          await axios.delete(`https://retina-result-server.vercel.app/admin/results/${id}`, { withCredentials: true });
          setResults((prevResults) => prevResults.filter((result) => result._id !== id));
          Swal.fire("Deleted!", "The result has been deleted.", "success");
        } catch (error) {
          console.error("Error deleting result:", error);
          Swal.fire("Error!", "Failed to delete the result.", "error");
        }
      }
    });
  };

  // Filter results by search
  const filteredResults = results?.filter((result) => result.Roll.toString().includes(searchRoll));

  return (
    <div className="p-4 flex flex-col items-center justify-center">
      <h1 className="text-xl font-bold mb-4">Student Results</h1>

      {/* Search Input */}
      <div className="mb-4 flex gap-2">
        <input
          type="text"
          className="input input-bordered"
          placeholder="Enter Roll to search"
          value={searchRoll}
          onChange={(e) => setSearchRoll(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid"></div>
        </div>
      ) : (
        <>
          {/* Results Table */}
          <div className="overflow-x-auto w-full">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>Roll</th>
                  <th>Name</th>
                  <th>Batch</th>
                  <th>Student</th>
                  <th>Guardian</th>
                  <th>Mark</th>
                  <th>Neg_mark</th>
                  <th>Position</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredResults?.map((result) => (
                  <tr key={result?._id}>
                    <td>{result?.Roll}</td>
                    <td>{result?.Name}</td>
                    <td>{result?.Batch}</td>
                    <td>{result?.Student}</td>
                    <td>{result?.Guardian}</td>
                    <td>{result?.Mark}</td>
                    <td>{result?.Neg_mark}</td>
                    <td>{result?.Position}</td>
                    <td>{result?.Date}</td>
                    <td>
                      <Link to={`/admin/results/edit/${result?._id}`} className="btn btn-sm btn-warning mr-2">
                        Edit
                      </Link>
                      <button onClick={() => handleDelete(result?._id)} className="btn btn-sm btn-error">
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
            <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} className="btn btn-sm" disabled={currentPage === 1}>
              Previous
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} className="btn btn-sm" disabled={currentPage === totalPages}>
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Result;
