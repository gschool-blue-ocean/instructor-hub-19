import React, { useState, useContext } from 'react';
import NewCohort from './NewCohort.jsx';
import CohortContext from '../../../Context/CohortContext.jsx';
import '../../../../styles/DashboardMenu.css';

const DashboardMenu = () => {
  const [showCohort, setShowCohort] = useState(false);
  const { cohort } = useContext(CohortContext);

  function handleClick() {
    setShowCohort(true);
  }

  return (
    <div id='DashboardMenu'>
      <button>Assessments</button>
      <button onClick={handleClick}>Create New Cohort</button>
      <NewCohort showCohort={showCohort} onClose={()=> setShowCohort(false)}/>
    </div>
  );
};

export default DashboardMenu;
