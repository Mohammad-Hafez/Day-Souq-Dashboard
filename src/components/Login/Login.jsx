import React, { useState } from 'react'
import * as Yup from 'yup'
import {  useFormik } from 'formik'
import {  useNavigate , Link} from 'react-router-dom'
import { Icon } from 'react-icons-kit';
import {eye} from 'react-icons-kit/feather/eye';
import {eyeOff} from 'react-icons-kit/feather/eyeOff'
import {login} from 'react-icons-kit/entypo/login'
import axios from 'axios';
import {ApiBaseUrl } from '../ApiBaseUrl'
import {alertCircle} from 'react-icons-kit/feather/alertCircle'
import toast from 'react-hot-toast';

export default function Login({saveUserData}) {
  const[isLoading,setIsLoading]=useState(false)
  const [passwordShown, setPasswordShown] = useState(false);
  const [ErrMsg, setErrMsg] = useState()
  const togglePassword = () => {
    setPasswordShown(!passwordShown);
  };
  let navigate = useNavigate()

  function makeLogged(values) {
    setIsLoading(true);
    setErrMsg(null);
  
    axios.post(ApiBaseUrl + `auth/login`, values)
      .then(response => {
        const { data } = response;
        toast.success(`Login Successfully. Enjoy Your Journey`, {
          className: 'first-z mt-5 bg-main-light ',
          duration: 2000,
        });
        localStorage.setItem("DaySooqDashUser", data.token);
        saveUserData();
        formik.resetForm();
        setIsLoading(false);
        navigate("/");
      })
      .catch(error => {
        toast.error(error.response.data.message, {
          className: 'first-z mt-5 bg-main-light ',
          duration: 2000,
        });
        console.error(error);
        setIsLoading(false);
        setErrMsg(error.response.data.message);
      });
  }
  
    let mySchema =Yup.object( {
    email:Yup.string().required("User Name is required"),
    password:Yup.string().required("password is required")
  })
  let formik = useFormik({
  initialValues:{
    email:"",
    password:"",
  },
  validationSchema:mySchema,
  onSubmit:(values)=> makeLogged(values)
  })
  return <>
  <div className="container login w-75 ">
      <form action=""  onSubmit={formik.handleSubmit} className='row text-center '>
      <div className="col-8 offset-2 m-auto my-3 w-auto p-4">
      <div className="row">
          <div className="col-12 text-start">
            <label className='ms-2' htmlFor="email">email</label>
            <input type="string"  placeholder='email' className='AuthForm-inputs mb-2 form-control' name='email' id='email' value={formik.values.email} onChange={formik.handleChange} onBlur={formik.handleBlur}/>
            {formik.errors.email && formik.touched.email ?<div className="alert alert-danger">{formik.errors.email}</div>: null}
          </div>
          <div className="col-12 text-start">
            <div className="passwordField position-relative">
              <label htmlFor="password" className='ms-2'>Password</label>
              <input type={passwordShown ? "text" : "password"} placeholder='Password' className='AuthForm-inputs mb-2 form-control' name='password' id='password'  onChange={formik.handleChange} onBlur={formik.handleBlur}/>
              <span onClick={togglePassword} className='togglePassword position-absolute top-0 end-0 me-3 mt-4 pt-1 cursor-pointer'>{passwordShown ? <Icon className='text-danger' icon={eye}></Icon>:<Icon className='text-main' icon={eyeOff}></Icon>}</span>
            </div>
            {formik.errors.password && formik.touched.password ?<div className="alert alert-danger">{formik.errors.password}</div>: null}
          </div>
        </div>
        <div className="col-12">
        {ErrMsg ? <div className="Err alert alert-danger"><Icon size={20} icon={alertCircle}> </Icon> {ErrMsg}</div> : null }
        </div>
        <div className="col-12 text-start">
        <Link className='dark-blue-text ms-3' to={'/ForgetPassword'}>forget Yor Password ?</Link>
        </div>
        <div className="btns col-12 my-2">
          {isLoading?
          <button type="button" className='btn btn-primary rounded-pill text-light me-2 w-100'><i className=' fa fa-spin fa-spinner'></i></button>
          :<>
          <button type="submit" disabled={!(formik.isValid && formik.dirty)} className='btn btn-primary rounded-pill text-light me-2 w-100 d-flex align-items-center justify-content-center'><span className='me-2'>LOGIN</span><Icon className='pb-1' size={20}  icon={login}></Icon></button>
          </>
          }
        </div>
      </div>
      </form>
    </div>
  </>
}