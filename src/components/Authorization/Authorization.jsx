import React, { useState } from 'react'
import { Helmet } from 'react-helmet'
import Login from '../Login/Login'
import Signup from '../Signup/Signup'

export default function Authorization({saveUserData}) {
  const [SelectAuth, setSelectAuth] = useState('login');
  const [ActiveAuth, setActiveAuth] = useState('login')
  const handleAuthChange = (role)=>{
    setSelectAuth(role);
    setActiveAuth(role)
  }
  return <>
    <Helmet>
      <title>Authorization </title>
    </Helmet>
    <div className="container p-2 d-flex justify-content-center align-items-center flex-column mt-3">
      <div className="selectAuth mb-0">
        <button className={`dark-blue-text mx-2 bg-transparent border-0 fs-4 ${ActiveAuth ==='login' ? 'activeAuth' : ''}`} onClick={()=>handleAuthChange('login')}>
          LOGIN
        </button>
        <button className={`dark-blue-text  ms-3 bg-transparent border-0 fs-4 ${ActiveAuth ==='signup' ? 'activeAuth' : ''}`}  onClick={()=>handleAuthChange('signup')}>
          SIGN UP
        </button>
      </div>
      {SelectAuth === 'login' ? <Login saveUserData={saveUserData}/> : <Signup saveUserData={saveUserData} handleAuthChange={handleAuthChange}/>}
    </div>
    </>
}
