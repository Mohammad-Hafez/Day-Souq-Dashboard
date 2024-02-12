import React, { useState } from 'react';
import { useFormik } from 'formik';
import axios from 'axios';
import {ApiBaseUrl} from '../ApiBaseUrl'
import * as Yup from 'yup';
import { Icon } from 'react-icons-kit'
import {eye} from 'react-icons-kit/feather/eye';
import {eyeOff} from 'react-icons-kit/feather/eyeOff'
import { IoPersonAdd } from "react-icons/io5";
import {alertCircle} from 'react-icons-kit/feather/alertCircle'
import toast from 'react-hot-toast';

const Register = ({handleAuthChange}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [passwordShown, setPasswordShown] = useState(false);
  const [passwordConfirmShown, setpasswordConfirmShown] = useState(false);
  const [ErrMsg, setErrMsg] = useState()
  const formik = useFormik({
    initialValues: {
      firstName: '',
      email: '',
      password: '',
      passwordConfirm: "",
      gender: '',
      lastName: '',
      phone: '',
      role: 'admin'
    },

    validationSchema: Yup.object().shape({
      firstName: Yup.string().required('Name is required'),
      email: Yup.string().email('Invalid email').required('Email is required'),
      password: Yup.string().required('Password is required'),
      passwordConfirm: Yup.string().required("required").oneOf([Yup.ref('password')],"passwordConfirm must matches Password"),
      gender: Yup.string().required('Gender is required'),
      lastName: Yup.string().required('lastName is required'),
      phone: Yup.string().required("required").matches(/^01[0125][0-9]{8}$/,"invalid mobile number")
    }),

    onSubmit: (values) => Signup(values)
  });

  function Signup(values) {
    setIsLoading(true);
    setErrMsg(null);
    axios.post(ApiBaseUrl + 'auth/register', values)
      .then(response => {
        toast.success(`Register Successfully.Login and Enjoy Your Journey`, {
          className: 'first-z mt-5 bg-main-light ',
          duration: 2000,
        });
        handleAuthChange('login')
        setIsLoading(false);
        formik.resetForm();
      })
      .catch(error => {
        setErrMsg(error.response.data.message);
        toast.error(error.response.data.message, {
          className: 'first-z mt-5 bg-main-light ',
          duration: 2000,
        });
        console.error(error);
        setIsLoading(false);
      });
  }
  
  const togglePassword = () => {
    setPasswordShown(!passwordShown);
  };
  const togglepasswordConfirm = () => {
    setpasswordConfirmShown(!passwordConfirmShown);
  };


  return <>
    <div className="container my-3 p-4 mx-auto">
      <form onSubmit={formik.handleSubmit}>
        <div className="row">
          <div className=" col-8 offset-2">
            <div className="row">
              <div className="col-md-6">
                {/*First name input */}
                <label className='ms-2' htmlFor="firstName">First Name</label>
                <input type="text" placeholder='First Name' className="form-control mb-2 AuthForm-inputs" id="firstName" name="firstName" value={formik.values.firstName} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                {formik.errors.firstName && formik.touched.firstName ? <div className="alert alert-danger">{formik.errors.firstName}</div>: null}
              </div>
              <div className="col-md-6">
                {/* lastName input */}
                <label className='ms-2' htmlFor="lastName">last Name </label>
                <input type="text" className="form-control mb-2 AuthForm-inputs" placeholder='last Name' id="lastName" name="lastName" value={formik.values.lastName} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                {formik.errors.lastName && formik.touched.lastName ?  <div className="alert alert-danger">{formik.errors.lastName}</div> : null}
              </div>
              <div className="col-md-6">
                {/* email input */}
                <label className='ms-2' htmlFor="email">Email</label>
                <input placeholder='Email@example.ex' type="email" className="form-control mb-2 AuthForm-inputs" id="email" name="email" value={formik.values.email} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                {formik.errors.email && formik.touched.email ?<div className="alert alert-danger">{formik.errors.email}</div> : null}
              </div>
              <div className="col-md-6">
                {/* gender input */}
                <label className='ms-2' htmlFor="gender">Gender</label>
                <select  className="form-control mb-2 AuthForm-inputs" id="gender" name="gender"  value={formik.values.gender} onChange={formik.handleChange} onBlur={formik.handleBlur} >
                  <option value="" disabled>Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
                {formik.errors.gender && formik.touched.gender ? <div className="alert alert-danger">{formik.errors.gender}</div> : null}
              </div>
              <div className="col-md-6">
                {/* mobile number input */}
                <label className='ms-2' htmlFor="phone">Mobile Number</label>
                <input type="text" className="form-control mb-2 AuthForm-inputs" id="phone" placeholder='Mobile Number' name="phone" value={formik.values.phone} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                {formik.errors.phone && formik.touched.phone ? <div className="alert alert-danger">{formik.errors.phone}</div> : null}
              </div>
            </div>
          </div>
          <div className="col-8 offset-2">
            <div className="row">
              <div className="col-sm-6">
                <div className="passwordField position-relative">
                  {/* password input */}
                  <label className='ms-1' htmlFor="password">Password</label>
                  <input type={passwordShown ? 'text' : 'password'} className="mb-2 form-control AuthForm-inputs" placeholder='Password' name="password" id="password" current-password = "true" value={formik.values.password} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                  <span onClick={togglePassword} className='togglePassword position-absolute top-0 end-0 me-3 mt-4 cursor-pointer'>{passwordShown ? <Icon className='text-danger' icon={eye}></Icon>:<Icon className='text-main' icon={eyeOff}></Icon>}</span>
                </div>
                {formik.errors.password && formik.touched.password ? <div className="alert alert-danger">{formik.errors.password}</div> : null}
              </div>
              <div className="col-sm-6">
                <div className="passwordField position-relative">
                  {/* Re-password input */}
                  <label className='ms-1' htmlFor="passwordConfirm">Re-Password</label>
                  <input type={passwordConfirmShown ? 'text' : 'Password'} className="mb-2 form-control AuthForm-inputs" placeholder='Password' name="passwordConfirm" id="passwordConfirm" current-password = "true" value={formik.values.passwordConfirm} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                  <span onClick={togglepasswordConfirm} className='togglePassword position-absolute top-0 end-0 me-3 mt-4 cursor-pointer'>{passwordConfirmShown ? <Icon className='text-danger' icon={eye}></Icon>:<Icon className='text-main' icon={eyeOff}></Icon>}</span>
                </div>
                {formik.errors.passwordConfirm && formik.touched.passwordConfirm ? <div className="alert alert-danger">{formik.errors.passwordConfirm}</div> : null}
              </div>
            </div>
          </div>
          <div className="col-8 offset-2">
          {ErrMsg ? <div className="Err alert alert-danger"><Icon size={20} icon={alertCircle}> </Icon> {ErrMsg}</div> : null }
          </div>
          <div className="btns col-6 offset-3 mt-2">
            {/* loading & signup btns */}
            {isLoading ? <button type="button" className="btn btn-primary rounded-pill w-100 text-light"><i className="fa fa-spin fa-spinner"></i></button>
             : 
              <button type="submit" disabled={!(formik.isValid && formik.dirty)} className="btn btn-primary w-100 rounded-pill d-flex align-items-center justify-content-center text-light">SIGN UP <IoPersonAdd className='ms-2' /></button>
            }
          </div>
        </div>
      </form>
    </div>
    </>
};

export default Register;