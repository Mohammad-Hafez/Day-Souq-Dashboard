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

export default function PasswordOtp() {
  let navigate = useNavigate();

  const [ErrMsg, setErrMsg] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const sendOtp = async (val) => {
    setIsLoading(true)
    try {
      let { data } = await axios.post(ApiBaseUrl + `auth/verifyOtp/${localStorage.getItem('forgetToken')}`, val);
      toast.success('OTP verified successfully', {
        className: 'first-z mt-5 bg-main-light ',
        duration: 2000,
      });
      setIsLoading(false)
      navigate('/ResetPassword');
    } catch (error) {
      setIsLoading(false)
      console.error(error);
      toast.error('Error verifying OTP. Please try again.');
      setErrMsg('Error verifying OTP. Please try again.');
    }
  };

  let mySchema = Yup.object({
    otp: Yup.string().required('OTP is required').matches(/^\d{4}$/, 'OTP must be exactly 4 digits'),
  });

  let formik = useFormik({
    initialValues: {
      otp: '',
    },
    validationSchema: mySchema,
    onSubmit: (values) => sendOtp(values),
  });

  return (
    <>
      <Helmet>
        <title>OTP Password</title>
      </Helmet>
      <div className="container login my-3">
        <form onSubmit={formik.handleSubmit} className="text-center">
          <div className="row">
            <div className="col-12 col-md-6 offset-md-3 col-lg-4 offset-lg-4 my-3">
              <div className="col-12 text-start">
                <label htmlFor="otp" className="ms-2">
                  Enter OTP
                </label>
                <input
                  type="text"
                  placeholder="Enter OTP received in email"
                  className="AuthForm-inputs mb-2 form-control"
                  name="otp"
                  id="otp"
                  value={formik.values.otp}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.errors.otp && formik.touched.otp && (
                  <div className="alert alert-danger">{formik.errors.otp}</div>
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
                    className="btn btn-orange rounded-pill text-light mx-auto w-75"
                  >
                    <span className="me-2">Verify OTP</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
