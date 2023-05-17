import React, { useState } from 'react';
import { AuthProvider } from 'react-auth-kit';
import Login from '../Login/Login';
import '../../styles/App.css';
import NavBar from '../NavBar/NavBar';
import Body from '../Body/Body';
import Footer from '../Footer/Footer';
import { CohortProvider } from '../Context/CohortContext.jsx';



const App = () => {
  const [ userAuth, setUserAuth ] = useState(false);

  return (
    <div id='App'>
      <AuthProvider
      authType={'localstorage'}
      authName={'_auth'}>
        {!userAuth ? <Login userAuth={()=> setUserAuth(true)}/> :
        <CohortProvider>
          <NavBar></NavBar>
          <Body></Body>
          <Footer></Footer>
        </CohortProvider>}
      </AuthProvider>
    </div>
  );
};

export default App;
