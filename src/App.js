import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { PrimeReactProvider} from 'primereact/api';
import { useEffect, useState } from 'react';
import { Icon } from 'react-icons-kit';
import {wifiOff} from 'react-icons-kit/feather/wifiOff'
import { Offline } from "react-detect-offline";
import  { Toaster } from 'react-hot-toast';
import Authorization from './components/Authorization/Authorization';
import ForgetPassword from './components/ForgetPassword/ForgetPassword';
import PasswordOtp from './components/PasswordOtp/PasswordOtp';
import ResetPassword from './components/ResetPassword/ResetPassword';
import Layout from './components/Layout/Layout';
import Categories from './components/Categories/Categories';
import ProtectedRoutes from './components/ProtectedRoutes/ProtectedRoutes';
import Home from './components/Home/Home';
import SubCategory from './components/SubCategory/SubCategory';
import NotFound from './components/NotFound/NotFound';
function App() {
  const [UserToken, setUserToken] = useState(null);
  function saveUserData(){
    let encodedPharmacistToken = localStorage.getItem("DaySooqDashUser");
    setUserToken(encodedPharmacistToken)
  }

  const Logout = () => {
    localStorage.removeItem("DaySooqDashUser");
    setUserToken(null);
  };
  
  useEffect(() => {
    const storedUserToken = localStorage.getItem('DaySooqDashUser');
    if (storedUserToken) {
      const decodedUserToken = jwtDecode(storedUserToken);
      if (decodedUserToken.exp * 1000 < Date.now()) {
        Logout();
      } else {
        setUserToken(storedUserToken);
      }
    }
  }, []);        

  return (
    <PrimeReactProvider>
        <Offline> <div className='network p-3 bg-danger text-light rounded align-items-center d-flex position-absolute bottom-0 start-0 m-4'> <Icon icon={wifiOff} className='me-2'></Icon> Faild Network Conection</div> </Offline>
        <Toaster/>
      <Router>
          <Routes>
            <Route path="" element={<Layout UserToken={UserToken} Logout={Logout}/>}>
            <Route path="Authorization" element={<Authorization saveUserData={saveUserData}/>} />
            <Route path="ForgetPassword" element={<ForgetPassword saveUserData={saveUserData}/>} /> 
            <Route path="PasswordOtp" element={<PasswordOtp saveUserData={saveUserData}/>} /> 
            <Route path="ResetPassword" element={<ResetPassword saveUserData={saveUserData}/>} /> 
            <Route index element={<ProtectedRoutes> <Home UserToken={UserToken}/> </ProtectedRoutes> } /> 
            <Route path="Categories" element={<ProtectedRoutes> <Categories UserToken={UserToken}/> </ProtectedRoutes> } /> 
            <Route path="SubCategory/:CategoryName/:id" element={<ProtectedRoutes> <SubCategory UserToken={UserToken}/> </ProtectedRoutes> } /> 
            <Route path="*" element={<NotFound/>} /> 
            </Route>
          </Routes>
          </Router>
    </PrimeReactProvider>
  );
}

export default App;
