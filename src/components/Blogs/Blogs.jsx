import React from 'react'
import { Helmet } from 'react-helmet'
export default function Blogs() {
  const user = localStorage.getItem("DaySooqDashUser") ;
  let headers = { 'Authorization': `Bearer ${user}` };

  return <>
    <Helmet>
      <title>Blogs</title>
    </Helmet>
    <div className="container">

    </div>
    </>
}
