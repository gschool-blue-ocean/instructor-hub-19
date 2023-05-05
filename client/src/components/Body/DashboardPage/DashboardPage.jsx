import React from 'react';
import '../../../styles/DashboardPage.css';
import DashboardMenu from './DashboardMenu/DashboardMenu';
import Students from './Students/Students';

const DashboardPage = () => {
  return (
    <div id='DashboardPage'>
      <DashboardMenu></DashboardMenu>
      <Students></Students>
      Dashboard Page
    </div>
  );
};

export default DashboardPage;