import React from 'react'
import { Helmet } from 'react-helmet'
import notfound from '../../assets/error.svg'
export default function NotFound() {
  return <>
    <Helmet>
      <title>DAY SOOQ | Not-Found</title>
    </Helmet>
    <div className='w-50 mx-auto'>
      <img className='w-100' src={notfound} alt="" />
    </div>
    </>
}
