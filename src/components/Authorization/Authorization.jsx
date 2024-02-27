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
    <div className="container d-flex justify-content-center align-items-center flex-column mt-0">
    <h1 className="text-muted fs-2 text-uppercase mb-4 font-quest fw-bold">
            Day Sooq Dashboard
          </h1>
  <div className="loginFormContainer bg-light p-3 rounded shadow text-center">
      <div className="selectAuth mb-0 ">

        <button className={`dark-blue-text mx-2 bg-transparent border-0 fs-3 ${ActiveAuth ==='login' ? 'activeAuth' : ''}`} onClick={()=>handleAuthChange('login')}>
          LOGIN
        </button>
      </div>
      {SelectAuth === 'login' && <Login saveUserData={saveUserData}/> }
      </div>
    </div>
    </>
}
