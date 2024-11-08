import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

const EditResult = () => {
  const { _id } = useParams(); 
  console.log(_id)
  const [studentData, setStudentData] = useState({
    Roll: "",
    Name: "",
    Batch: "",
    Student: "",
    Guardian: "",
    Mark: "",
    D: "",
    Neg_mark: "",
    Position: "",
  });

  const navigate = useNavigate();

  // Fetch data for the specific student by roll number
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/admin/results/${_id}`
        );
        setStudentData(response.data);
      } catch (error) {
        console.error("Error fetching student data:", error);
      }
    };

    fetchData();
  }, [_id]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setStudentData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:5000/admin/results/${_id}`,
        studentData
      );
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Your work has been saved",
        showConfirmButton: false,
        timer: 1500,
      });
      navigate("/admin");
    } catch (error) {
      console.error("Error updating data:", error);
      alert("Failed to update data.");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Edit Student Result</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label">Roll</label>
          <input
            type="text"
            name="Roll"
            value={studentData.Roll}
            disabled
            className="input input-bordered w-full"
          />
        </div>
        <div>
          <label className="label">Name</label>
          <input
            type="text"
            name="Name"
            value={studentData.Name}
            onChange={handleChange}
            className="input input-bordered w-full"
          />
        </div>
        <div>
          <label className="label">Batch</label>
          <input
            type="text"
            name="Batch"
            value={studentData.Batch}
            onChange={handleChange}
            className="input input-bordered w-full"
          />
        </div>
        <div>
          <label className="label">Student Phone</label>
          <input
            type="text"
            name="Student"
            value={studentData.Student}
            onChange={handleChange}
            className="input input-bordered w-full"
          />
        </div>
        <div>
          <label className="label">Guardian Phone</label>
          <input
            type="text"
            name="Guardian"
            value={studentData.Guardian}
            onChange={handleChange}
            className="input input-bordered w-full"
          />
        </div>
        <div>
          <label className="label">Mark</label>
          <input
            type="number"
            name="Mark"
            value={studentData.Mark}
            onChange={handleChange}
            className="input input-bordered w-full"
          />
        </div>
        <div>
          <label className="label">D</label>
          <input
            type="number"
            name="D"
            value={studentData.D}
            onChange={handleChange}
            className="input input-bordered w-full"
          />
        </div>
        <div>
          <label className="label">Negative Mark</label>
          <input
            type="number"
            name="Neg_mark"
            value={studentData.Neg_mark}
            onChange={handleChange}
            className="input input-bordered w-full"
          />
        </div>
        <div>
          <label className="label">Position</label>
          <input
            type="number"
            name="Position"
            value={studentData.Position}
            onChange={handleChange}
            className="input input-bordered w-full"
          />
        </div>
        <button type="submit" className="btn btn-primary mt-4">
          Update Result
        </button>
      </form>
    </div>
  );
};

export default EditResult;
