import React, { useState } from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import {  useNavigate , Link} from 'react-router-dom'
import { Icon } from 'react-icons-kit';
import { eye } from 'react-icons-kit/feather/eye';
import { eyeOff } from 'react-icons-kit/feather/eyeOff';
import { login } from 'react-icons-kit/entypo/login';
import axios from 'axios';
import { ApiBaseUrl } from '../ApiBaseUrl';
import { alertCircle } from 'react-icons-kit/feather/alertCircle';
import toast from 'react-hot-toast';

export default function ResetPassword({saveUserData}) {

  const [isLoading, setIsLoading] = useState(false);
  const [passwordShown, setPasswordShown] = useState(false);
  const [confirmPasswordShown, setConfirmPasswordShown] = useState(false);
  const [errMsg, setErrMsg] = useState(null);
  const navigate = useNavigate();

  const togglePassword = () => {
    setPasswordShown(!passwordShown);
  };

  const toggleConfirmPassword = () => {
    setConfirmPasswordShown(!confirmPasswordShown);
  };

  async function changeUserPassword(values) {
    setIsLoading(true);
    setErrMsg(null);
    try {
      let { data } = await axios.patch(ApiBaseUrl + `auth/resetPassword/${localStorage.getItem('forgetToken')}`, values );
      toast.success(`${data?.message}`, {
        className: 'first-z mt-5 bg-main-light ',
        duration: 2000,
    });
      setIsLoading(false);
      formik.resetForm();
      navigate('/Authorization');
    } catch (error) {
      toast.error("An Error Occured. Try again later", {
        className: 'first-z mt-5 bg-main-light ',
        duration: 2000,
      });  
      console.error(error);
      setIsLoading(false);
      setErrMsg(`Login Failed: Your email or password is incorrect`);
    }
  }

  const mySchema = Yup.object({
    password: Yup.string().required('New Password is required'),
    passwordConfirm: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Confirm Password is required'),
  });

  const formik = useFormik({
    initialValues: {
      password: '',
      passwordConfirm: '',
    },
    validationSchema: mySchema,
    onSubmit: (values) => changeUserPassword(values),
  });

  return (
    <div className="container login w-75">
      <form onSubmit={formik.handleSubmit} className="text-center">
        <div className="row">
          <div className="col-8 offset-2 my-3 p-4">
            <div className="w-75 mx-auto">
              {/* New Password */}
              <div className="col-12 text-start">
                <div className="passwordField position-relative">
                  <label htmlFor="password" className="ms-2">
                    New Password
                  </label>
                  <input
                    type={passwordShown ? 'text' : 'password'}
                    placeholder="New Password"
                    className="AuthForm-inputs mb-2 form-control"
                    name="password"
                    id="password"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  <span
                    onClick={togglePassword}
                    className="togglePassword position-absolute top-0 end-0 me-3 mt-4 pt-1 cursor-pointer"
                  >
                    {passwordShown ? <Icon className="text-danger" icon={eye} /> : <Icon className="text-main" icon={eyeOff} />}
                  </span>
                </div>
                {formik.errors.password && formik.touched.password && (
                  <div className="alert alert-danger">{formik.errors.password}</div>
                )}
              </div>

              {/* Confirm Password */}
              <div className="col-12 text-start">
                <div className="passwordField position-relative">
                  <label htmlFor="passwordConfirm" className="ms-2">
                    Confirm Password
                  </label>
                  <input
                    type={confirmPasswordShown ? 'text' : 'password'}
                    placeholder="Confirm Password"
                    className="AuthForm-inputs mb-2 form-control"
                    name="passwordConfirm"
                    id="passwordConfirm"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  <span
                    onClick={toggleConfirmPassword}
                    className="togglePassword position-absolute top-0 end-0 me-3 mt-4 pt-1 cursor-pointer"
                  >
                    {confirmPasswordShown ? (
                      <Icon className="text-danger" icon={eye} />
                    ) : (
                      <Icon className="text-main" icon={eyeOff} />
                    )}
                  </span>
                </div>
                {formik.errors.passwordConfirm && formik.touched.passwordConfirm && (
                  <div className="alert alert-danger">{formik.errors.passwordConfirm}</div>
                )}
              </div>
            </div>

            {/* Error Message */}
            <div className="col-12">
              {errMsg && (
                <div className="Err alert alert-danger w-75 mx-auto">
                  <Icon size={20} icon={alertCircle} /> {errMsg}
                </div>
              )}
            </div>

            {/* Buttons */}
            <div className="btns col-12 my-2">
              {isLoading ? (
                <button type="button" className="btn btn-orange rounded-pill text-light w-75 mx-auto">
                  <i className=" fa fa-spin fa-spinner"></i>
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={!(formik.isValid && formik.dirty)}
                  className="btn btn-orange rounded-pill text-light mx-auto w-75 d-flex align-items-center justify-content-center"
                >
                  <span className="me-2">Change Password</span>
                  <Icon className="pb-1" size={20} icon={login} />
                </button>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
