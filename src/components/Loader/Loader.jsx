import React from 'react'
import { RotatingTriangles } from "react-loader-spinner";

const Loader = () => {
    return ( <div className="loader-container  d-flex align-items-center justify-content-center">
      <RotatingTriangles
  visible={true}
  height="50%"
  width="20%"
  color="#4fa94d"
  ariaLabel="rotating-triangles-loading"
  wrapperStyle={{}}
  wrapperClass=""
  />    

    </div>
  )
}

export default Loader;