import React from 'react'
import Header from '../Header/Header'
import { Outlet } from 'react-router-dom'
import Footer from '../Footer/Footer'

export default function Layout({UserToken , Logout}) {
  return <>
      <div className="layout  d-flex flex-column justify-content-between align-items-stretch min-vh-100">
        <Header UserToken={UserToken} Logout={Logout}/>
        <div className="outlet">
          <Outlet/>
        </div>
        <Footer/>
      </div>
    </>
}
