import React, { useState, useEffect, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretUp, faCaretDown } from '@fortawesome/free-solid-svg-icons';
import AssessmentCard from './AssessmentCard/AssessmentCard';
import styles from './AssessmentsTable.module.css';
import CohortContext from '../../../../../../Context/CohortContext';

const AssessmentsTable = ({ assessments }) => {

  const { setBodyDisplay } = useContext(CohortContext);

  const [sortConfig, setSortConfig] = useState({
    key: '',
    direction: '',
  });
  const [selectedRow, setSelectedRow] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedAssessments = [...assessments].sort((a, b) => {
    const key = sortConfig.key;
    const direction = sortConfig.direction === 'ascending' ? 1 : -1;

    if (key === 'student_name' || key === 'assess_name') {
      return a[key].localeCompare(b[key]) * direction;
    } else if (key === 'grade' || key === 'cohort_number') {
      return (a[key] - b[key]) * direction;
    }

    return 0;
  });

  const handleRowClick = (index) => {
    setSelectedRow(index === selectedRow ? null : index);
  };

  const handleCloseModal = () => {
    setSelectedRow(null);
  };
  

  return (
    <div className={styles.tableContainer}>
      <div className={styles.tableHeader}>
        <table>
          <thead>
            <tr>
              <th className={styles.column1}>
                Name{' '}
                <FontAwesomeIcon
                  icon={faCaretUp}
                  className={styles['name-arrow']}
                  onClick={() => handleSort('student_name')}
                />
              </th>
              <th className={styles.column5}>
                Assessment{' '}
                <FontAwesomeIcon
                  icon={faCaretUp}
                  className={styles['assessment-arrow']}
                  onClick={() => handleSort('assess_name')}
                />
              </th>
              <th className={styles.column6}>
                Grade{' '}
                <FontAwesomeIcon
                  icon={faCaretUp}
                  className={styles['grade-arrow']}
                  onClick={() => handleSort('grade')}
                />
              </th>
              <th className={styles.column6}>
                Cohort{' '}
                <FontAwesomeIcon
                  icon={faCaretUp}
                  className={styles['cohort-arrow']}
                  onClick={() => handleSort('cohort_number')}
                />
              </th>
            </tr>
          </thead>
        </table>
      </div>
      <div className={styles.tableBody}>
        <table>
          <tbody>
            {sortedAssessments.map((assessment, index) => (
              <React.Fragment key={`Assessment_${index}`}>
                <tr
                  className={selectedRow === index ? styles.selectedRow : ''}
                  onClick={() => handleRowClick(index)}
                >
                  <td>{assessment.student_name}</td>
                  <td>{assessment.assess_name}</td>
                  <td>{assessment.grade}</td>
                  <td>{assessment.cohort_number}</td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
      {selectedRow !== null && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <AssessmentCard
              assessment={assessments[selectedRow]}
              closeModal={handleCloseModal}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AssessmentsTable;
