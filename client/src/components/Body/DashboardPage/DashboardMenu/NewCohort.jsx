import React, { useState, useContext } from 'react';
import CohortContext from '../../../Context/CohortContext.jsx';
import '../../../../styles/Students.css'



const NewCohort = ({ showCohort, onClose }) => {
    const [ inputError, setInputError ] = useState('')    
    const { cohort } = useContext(CohortContext);
  
    if (!showCohort) {
      return null;
    }

    function handleCancel() {
      onClose(false);
    }

    function gatherValues() {
      let cohortNum = document.getElementById('cohortNum');
      let start = document.getElementById('startDate');
      let grad = document.getElementById('gradDate');
      let instructor = document.getElementById('instructor');
      if (!cohortNum.value || !start.value || !grad.value || !instructor.value) {
        // setInputError('All fields must contain information!');
        return;
      }
      let cohortVals = {};
      cohortVals.cohort_number = parseInt(cohortNum.value);
      cohortVals.start = start.value;
      cohortVals.graduation = grad.value;
      cohortVals.instructor = instructor.value;
      return cohortVals;
    }

    function handleClick() {
      const newCohort = gatherValues();
      if (!newCohort) {
        setInputError('Please fill out all fields!');
        return;
      } else if (Number.isNaN(newCohort.cohort_number)) {
        setInputError('Cohort number must be a number!');
        return;
      }
      console.log(newCohort);
      fetch('http://localhost:8000/cohorts', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCohort)
      })
      .then((response) => response.json())
      .then((response) => console.log(response))
      .then(onClose());
    }
  
    return (
      <div
        className='student-modal'
        onClick={handleCancel}
      >
        <div
          className='student-modal-form'
          onClick={(e) => e.stopPropagation()}
        >
          <div className='student-modal-header'>
            <h3 className='student-modal-title'>
              Add a New Cohort
            </h3>
          </div>
          <div className='student-modal-body'>
            <p>{inputError}</p>
            <div>
              <label htmlFor='cohortNum'>Cohort Number: </label>
              <input
                className='input-box'
                type='text'
                name='cohortNum'
                id='cohortNum'
                placeholder='number...'
                required
              ></input>
            </div>
            <div>
              <label htmlFor='startDate'>Start Date: </label>
              <input
                className='input-box'
                type='text'
                name='startDate'
                id='startDate'
                placeholder='MM/DD/YYYY...'
                required
              ></input>
            </div>
            <div>
              <label htmlFor='gradDate'>Graduation Date: </label>
              <input
                className='input-box'
                type='text'
                name='gradDate'
                id='gradDate'
                placeholder='MM/DD/YYYY...'
                required
              ></input>
            </div>
            <div>
              <label htmlFor='instructor'>Instructor Name: </label>
              <input
                className='input-box'
                type='text'
                name='instructor'
                id='instructor'
                placeholder='First and last name...'
                required
              ></input>
            </div>
          </div>
          <div className='student-modal-buttons'>
            <button
              onClick={handleClick}
              className='add-student'
            >
              Add Cohort
            </button>
            <button
              onClick={handleCancel}
              className='cancel-student'
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  export default NewCohort;