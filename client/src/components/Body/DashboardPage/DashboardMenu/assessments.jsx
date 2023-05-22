import React, { useState, useEffect } from "react";

const Assessments = ({ closeAssessment }) => {
  const [assessment, setAssessment] = useState([]);

  useEffect(() => {
    fetchAssessments();
  }, []);

  const fetchAssessments = () => {
    fetch("http://localhost:8000/assessments")
      .then((response) => response.json())
      .then((data) => setAssessment(data));
  };
  console.log("assessments:", assessment);

  return (
    <div>
      <div className="student-modal">
        <div className="student-modal-form">
          <div className="studant-modal-buttons">
            <button onClick={() => closeAssessment(false)}>x</button>
          </div>
          <div className="student-modal-header">
            <h1>Assessment</h1>
          </div>
          <div className="student-modal-body">
            <select>
              {assessment.map((value, key)=>(
                <option key={key} value={value.id}>
                  {value.assess_name} | {value.type}
                </option>
              ))}
            </select>
          </div>
          <div className="studant-modal-buttons"></div>
          <button>Next</button>
        </div>
      </div>
    </div>
  );
};

export default Assessments;
