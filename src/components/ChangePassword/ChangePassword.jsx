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

export default function ChangePassword({Logout}) {
  const headers = {
    'Authorization': `Bearer ${localStorage.getItem('DaySooqUser')}`,
  };

  const [isLoading, setIsLoading] = useState(false);
  const [passwordShown, setPasswordShown] = useState(false);
  const [currentPasswordShown, setCurrentPasswordShown] = useState(false);
  const [confirmPasswordShown, setConfirmPasswordShown] = useState(false);
  const [errMsg, setErrMsg] = useState(null);
  const navigate = useNavigate();

  const togglePassword = () => {
    setPasswordShown(!passwordShown);
  };

  const toggleCurrentPassword = () => {
    setCurrentPasswordShown(!currentPasswordShown);
  };

  const toggleConfirmPassword = () => {
    setConfirmPasswordShown(!confirmPasswordShown);
  };

  async function changeUserPassword(values) {
    setIsLoading(true);
    setErrMsg(null);
    try {
      let { data } = await axios.patch(ApiBaseUrl + `users/updatePassword`, values , {headers});
      toast.success(`${data?.message}`, {
        className: 'first-z mt-5 bg-main-light ',
        duration: 2000,
    });
      setIsLoading(false);
      formik.resetForm();
      Logout()
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
    currentPassword: Yup.string().required('Current Password is required'),
    newPassword: Yup.string().required('New Password is required'),
    newPasswordConfirm: Yup.string()
      .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
      .required('Confirm Password is required'),
  });

  const formik = useFormik({
    initialValues: {
      currentPassword: '',
      newPassword: '',
      newPasswordConfirm: '',
    },
    validationSchema: mySchema,
    onSubmit: (values) => changeUserPassword(values),
  });

  return (
    <div className="container login w-75">
      <form onSubmit={formik.handleSubmit} className="text-center">
        <div className="row">
          <div className="changePassForm col-8 offset-2 my-3 p-4">
            <div className="w-75 mx-auto">
              {/* Current Password */}
              <div className="col-12 text-start">
                <div className="passwordField position-relative">
                  <label htmlFor="currentPassword" className="ms-2">
                    Current Password
                  </label>
                  <input
                    type={currentPasswordShown ? 'text' : 'password'}
                    placeholder="Current Password"
                    className="AuthForm-inputs mb-2 form-control"
                    name="currentPassword"
                    id="currentPassword"
                    value={formik.values.currentPassword}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  <span
                    onClick={toggleCurrentPassword}
                    className="togglePassword position-absolute top-0 end-0 me-3 mt-4 pt-1 cursor-pointer"
                  >
                    {currentPasswordShown ? (
                      <Icon className="text-danger" icon={eye} />
                    ) : (
                      <Icon className="text-main" icon={eyeOff} />
                    )}
                  </span>
                </div>
                {formik.errors.currentPassword && formik.touched.currentPassword && (
                  <div className="alert alert-danger">{formik.errors.currentPassword}</div>
                )}
              </div>

              {/* New Password */}
              <div className="col-12 text-start">
                <div className="passwordField position-relative">
                  <label htmlFor="newPassword" className="ms-2">
                    New Password
                  </label>
                  <input
                    type={passwordShown ? 'text' : 'password'}
                    placeholder="New Password"
                    className="AuthForm-inputs mb-2 form-control"
                    name="newPassword"
                    id="newPassword"
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
                {formik.errors.newPassword && formik.touched.newPassword && (
                  <div className="alert alert-danger">{formik.errors.newPassword}</div>
                )}
              </div>

              {/* Confirm Password */}
              <div className="col-12 text-start">
                <div className="passwordField position-relative">
                  <label htmlFor="newPasswordConfirm" className="ms-2">
                    Confirm Password
                  </label>
                  <input
                    type={confirmPasswordShown ? 'text' : 'password'}
                    placeholder="Confirm Password"
                    className="AuthForm-inputs mb-2 form-control"
                    name="newPasswordConfirm"
                    id="newPasswordConfirm"
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
                {formik.errors.newPasswordConfirm && formik.touched.newPasswordConfirm && (
                  <div className="alert alert-danger">{formik.errors.newPasswordConfirm}</div>
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

            <div className="w-75 mx-auto text-start">
              <Link className='dark-blue-text ms-2' to={'/ForgetPassword'} onClick={Logout}>forget Yor Password ?</Link>
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
