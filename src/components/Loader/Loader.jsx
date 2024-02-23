import React from 'react'
import { InfinitySpin } from "react-loader-spinner";

const Loader = () => {
    return ( <div className="loader-container  d-flex align-items-center justify-content-center">
  <InfinitySpin className="mx-auto text-center"
  visible={true}
  color="#FF6000"
  ariaLabel="infinity-spin-loading"
  />

    </div>
  )
}

export default Loader;