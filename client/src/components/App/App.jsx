import React, { Component } from 'react';
import '../../styles/App.css';
import NavBar from '../NavBar/NavBar';
import Body from '../Body/Body';
import Footer from '../Footer/Footer';
import { CohortProvider } from '../Context/CohortContext.jsx';



const App = () => {
  return (
    <div id='App'>
      <CohortProvider>
        <NavBar></NavBar>
        <Body></Body>
        <Footer></Footer>
      </CohortProvider>
    </div>
  );
};

export default App;
