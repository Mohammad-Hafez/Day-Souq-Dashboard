import React from 'react'
import { Helmet } from 'react-helmet'
export default function NotFound() {
  return <>
    <Helmet>
      <title>DAY SOOQ | Not-Found</title>
    </Helmet>
    <div className="container not-found">
        <h1 className='light-red-text'>Page Not Found</h1>
    </div>
    </>
}
