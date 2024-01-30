import axios from 'axios';
import React, { useState } from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { ApiBaseUrl } from '../ApiBaseUrl';
import { Icon } from 'react-icons-kit';
import { alertCircle } from 'react-icons-kit/feather/alertCircle';
import toast from 'react-hot-toast';

export default function ForgetPassword() {
  let navigate = useNavigate();

  const [ErrMsg, setErrMsg] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const sendRecoverEmail = async (values) => {
    try {
      setIsLoading(true);
      let {data} = await axios.post(ApiBaseUrl + 'auth/forgetPassword', values);
      setIsLoading(false);
        localStorage.setItem('forgetToken' , data.token);
        navigate('/PasswordOtp')
        toast.success(`Email Send Successfully. Get Your OTP`, {
          className: 'first-z mt-5 bg-main-light ',
          duration: 2000,
        });
    } catch (error) {
      setIsLoading(false);
      setErrMsg('Error sending email')
      console.error('Error sending email:', error);
    }
  };

  let mySchema = Yup.object({
    email: Yup.string().email('Enter a valid email').required('Email is required'),
  });

  let formik = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema: mySchema,
    onSubmit: (values) => sendRecoverEmail(values),
  });

  return (
    <>
      <Helmet>
        <title>Forget Password</title>
      </Helmet>
      <div className="container login my-3 px-4">
        <form onSubmit={formik.handleSubmit} className="">
        <h5 className='dark-blue-text fw-bolder ms-2'>Enter Your Recovery Email</h5>
          <div className="row">
            <div className="col-12 col-md-6 offset-md-3 col-lg-4 offset-lg-4">
              <div className="w-75 mx-auto">
                <div className="col-12 text-start">
                  <label htmlFor="email" className="ms-2">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="Email"
                    className="AuthForm-inputs mb-2 form-control"
                    name="email"
                    id="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.errors.email && formik.touched.email && (
                    <div className="alert alert-danger">{formik.errors.email}</div>
                  )}
                </div>

                <div className="col-12">
                  {ErrMsg && (
                    <div className="Err alert alert-danger w-75 mx-auto">
                      <Icon size={20} icon={alertCircle} /> {ErrMsg}
                    </div>
                  )}
                </div>

                <div className="btns col-12 my-2 text-center">
                  {isLoading ? (
                    <button type="button" className="btn btn-orange rounded-pill text-light w-75 mx-auto">
                      <i className=" fa fa-spin fa-spinner"></i>
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={!(formik.isValid && formik.dirty)}
                      className="btn btn-orange rounded-pill text-light mx-auto w-75 "
                    >
                      <span className="me-2">Send Email</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
