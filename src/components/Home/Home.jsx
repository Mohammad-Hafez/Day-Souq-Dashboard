import React from 'react'
import { Helmet } from 'react-helmet'
export default function Home() {
  return <>
    <Helmet>
      <title>title</title>
    </Helmet>
    <div className="home">
      <h1>
        Welcome In Day Sooq Dashboard
      </h1>
    </div>
    </>
}
