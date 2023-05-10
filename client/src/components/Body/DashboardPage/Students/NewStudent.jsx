import React, { useState, useEffect, useContext } from 'react';
import CohortContext from '../../../Context/CohortContext.jsx';
import '../../../../styles/Students.css';

const NewStudent = (props) => {
    const { cohort } = useContext(CohortContext);

    if (!props.showModal) {
        return null;
    }
    
    function gatherValues() {
        let name = document.getElementById('studentName');
        let email = document.getElementById('email');
        let gitHub = document.getElementById('gitHub');
        let allValues = {};
        allValues.stu_name = name.value;
        allValues.email = email.value;
        allValues.gitHub = gitHub.value;
        allValues.cohort_number = parseInt(cohort);
        return allValues;
    }

    function handleClick() {
        const newStudent = gatherValues();
        console.log(newStudent);
        fetch('http://localhost:8000/students', 
        { 
            method: 'POST',
            credentials: "same-origin",
            headers: {"Content-Type": 'application/json'},
            body: JSON.stringify(newStudent)
        })
        .then(response => response.json())
        .then(response => console.log(response))
        .then(props.onClose())
        .then(props.onAdd());
    }

  
    return (
      <div className='student-modal' onClick={props.onClose}>
        <div className='student-modal-form' onClick={e => e.stopPropagation()}>
            <div className='student-modal-header'>
                <h3 className='student-modal-title'>Add a New Student to MCSP-{cohort}</h3>
            </div>
            <div className='student-modal-body'>
                <div>
                    <label htmlFor="name">First and Last Name: </label>
                    <input className="input-box" type="text" name='name' id="studentName" placeholder='name...' required></input>
                </div>
                <div>
                    <label htmlFor="email">Email Address: </label>
                    <input className="input-box" type="text" name='email' id="email" placeholder='email...' required></input>
                </div>
                <div>
                    <label htmlFor="github">GitHub Account: </label>
                    <input className="input-box" type="text" name='github' id="gitHub" placeholder='github...' required></input>
                </div>
            </div>
            <div className='student-modal-buttons'>
                <button onClick={handleClick} className='add-student'>Add Student</button>
                <button onClick={props.onClose} className='cancel-student'>Cancel</button>
            </div>
        </div>        
      </div>
    );
  };
  
  export default NewStudent;