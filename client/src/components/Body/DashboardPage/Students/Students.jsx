import React, { useState, useEffect, useContext } from 'react';
import CohortContext from '../../../Context/CohortContext.jsx';
import StudentTable from './StudentTable.jsx';
import NewStudent from './NewStudent.jsx';
import '../../../../styles/Students.css';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const { cohort } = useContext(CohortContext);

  useEffect(() => {
    (async () => {
      const response = await fetch(`http://localhost:8000/students/${cohort}`);
      const studs = await response.json();
      setStudents(studs);
      // console.log(studs);
    })();
    return () => {};
  }, [cohort]);

  return (
    <div>
      <div
        id='Students'
        className='building-block'
      >
        <div className='students-block-header'>
          <h1>Students</h1>
          <button onClick={() => setShowModal(true)}>Add Student</button>
        </div>
        <NewStudent
          onClose={() => setShowModal(false)}
          showModal={showModal}
        />
        <StudentTable stud={students} />
      </div>
    </div>
  );
};

export default Students;
