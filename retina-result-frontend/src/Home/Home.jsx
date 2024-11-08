import  { useState, useRef } from "react";
import axios from "axios";
import { useReactToPrint } from "react-to-print";

const Home = () => {
  const [Roll, setRollNo] = useState("");
  const [Mobile, setMobileNo] = useState("");
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [studentInfo, setStudentInfo] = useState(null);

  const contentRef = useRef(null);

  const fetchStudentInfo = async () => {
    try {
      const response = await axios.get("http://localhost:5000/basic-info", {
        params: { Roll, Mobile },
      });
      setStudentInfo(response.data);
    } catch (error) {
      console.error(error);
      setStudentInfo(null);
    }
  };

  const fetchResults = async () => {
    try {
      const response = await axios.get("http://localhost:5000/results", {
        params: { Roll, Mobile },
      });
      setResults(response.data);
      setShowResults(true);
    } catch (error) {
      console.error(error);
    }
  };

  const handleFindResult = async () => {
    await fetchStudentInfo();
    await fetchResults();
  };

  const handlePrint = useReactToPrint({
    content: () => contentRef.current,
    documentTitle: "Student Result",
    onAfterPrint: () => alert("Print complete"),
  });

  return (
    <div className="App flex flex-col items-center justify-center p-4 md:p-8 lg:p-12">
      <div className="card w-full max-w-md shadow-lg">
        <div className="card-body">
          <h2 className="card-title text-center text-lg md:text-xl font-semibold">
            RETINA Medical & Dental Admission Coaching - FIND YOUR RESULT
          </h2>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Student ID</span>
            </label>
            <input
              type="number"
              placeholder="Enter Student ID here"
              value={Roll}
              onChange={(e) => setRollNo(e.target.value)}
              className="input input-bordered w-full"
            />
          </div>
          <div className="form-control mt-4">
            <label className="label">
              <span className="label-text">Mobile Number</span>
            </label>
            <input
              type="password"
              placeholder="Enter Mobile Number"
              value={Mobile}
              autoComplete="off"
              onChange={(e) => setMobileNo(e.target.value)}
              className="input input-bordered w-full"
            />
          </div>
          <div className="card-actions mt-6 flex justify-center">
            <button
              onClick={handleFindResult}
              className="btn btn-primary w-full"
            >
              Find Result
            </button>
          </div>
        </div>
      </div>

      {showResults && (
        <div
          ref={contentRef}
          style={{ width: "100%" }}
          className="mt-8 w-full max-w-3xl bg-white p-4 sm:p-6 rounded-lg shadow-lg overflow-x-auto"
        >
          <h3 className="text-lg md:text-2xl font-semibold text-center mb-4 md:mb-6">
            Retina Medical & Dental Admission Coaching
          </h3>

          {studentInfo && (
            <div className="mt-8 w-full max-w-md p-4">
              <div className="grid grid-cols-3 gap-4 text-left">
                <div>
                  <strong>Name:</strong>
                </div>
                <div className="col-span-2">{studentInfo?.Name}</div>
                <div>
                  <strong>Roll:</strong>
                </div>
                <div className="col-span-2">{studentInfo?.Roll}</div>
                <div>
                  <strong>Batch:</strong>
                </div>
                <div className="col-span-2">{studentInfo?.Batch}</div>
              </div>
            </div>
          )}

          {results?.length > 0 ? (
            <table className="w-full text-left border-collapse overflow-hidden rounded-lg shadow-sm">
              <thead className="bg-gray-200">
                <tr>
                  <th className="py-2 sm:py-3 px-2 sm:px-4 border-b font-semibold text-gray-700">
                    SL No
                  </th>
                  <th className="py-2 sm:py-3 px-2 sm:px-4 border-b font-semibold text-gray-700">
                    Subject
                  </th>
                  <th className="py-2 sm:py-3 px-2 sm:px-4 border-b font-semibold text-gray-700">
                    Marks
                  </th>
                  <th className="py-2 sm:py-3 px-2 sm:px-4 border-b font-semibold text-gray-700">
                    (-)Marks
                  </th>
                  <th className="py-2 sm:py-3 px-2 sm:px-4 border-b font-semibold text-gray-700">
                    Deduction
                  </th>
                  <th className="py-2 sm:py-3 px-2 sm:px-4 border-b font-semibold text-gray-700">
                    Position
                  </th>
                  <th className="py-2 sm:py-3 px-2 sm:px-4 border-b font-semibold text-gray-700">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {results?.map((result, index) => (
                  <tr
                    key={index}
                    className={`border-b last:border-none ${
                      index % 2 === 0 ? "bg-gray-50" : "bg-white"
                    }`}
                  >
                    <td className="py-2 sm:py-3 px-2 sm:px-4">{index + 1}</td>
                    <td className="py-2 sm:py-3 px-2 sm:px-4">
                      {result?.Subject}
                    </td>
                    <td className="py-2 sm:py-3 px-2 sm:px-4">{result?.Mark}</td>
                    <td className="py-2 sm:py-3 px-2 sm:px-4">
                      {result?.Neg_mark}
                    </td>
                    <td className="py-2 sm:py-3 px-2 sm:px-4">
                      {result?.D}
                    </td>
                    <td className="py-2 sm:py-3 px-2 sm:px-4">
                      {result.Position}
                    </td>
                    <td className="py-2 sm:py-3 px-2 sm:px-4">{result.Date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-center text-gray-600">
              No results found for the entered details.
            </p>
          )}
        </div>
      )}
      {showResults && studentInfo && results.length > 0 && (
        <button onClick={handlePrint} className="btn btn-secondary mt-6">
          Print Result
        </button>
      )}
    </div>
  );
};

export default Home;
