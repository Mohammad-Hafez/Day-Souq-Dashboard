import React, {useState } from 'react';
import { Icon } from 'react-icons-kit';
import { androidPerson } from 'react-icons-kit/ionicons/androidPerson';
import { FiLogOut } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {ApiBaseUrl} from '../ApiBaseUrl'
import { AiOutlineLogin } from "react-icons/ai";
import { useQuery } from 'react-query';
import { CiMenuBurger } from 'react-icons/ci';

export default function HeaderSearch({ UserToken , Logout}) {
  let navigate = useNavigate();

  const [activeLink, setActiveLink] = useState();

  const user = localStorage.getItem('DaySooqDashUser');
  
  const headers = {
    'Authorization': `Bearer ${user}`,
  };

  const getMyProfile = () => axios.get(ApiBaseUrl + `users/profile`, { headers });
  const { data } = useQuery('my-profile', getMyProfile, { cacheTime: 5000 ,  enabled: !!user});

  const NavItem = ({ to, activeLink, onClick, name }) => (
    <li className="nav-item">
      <Link
        to={`${name}`}
        className={`nav-link px-3 dark-grey-text ${activeLink === name ? 'active' : ''}`}
        onClick={() => {
          onClick(name);
        }}
      >
        {name}
      </Link>
    </li>
  );

  return (
    <>
      <div className="search-header container-fluid mb-2 py-3 px-1 bg-light">
        <div className="row align-items-center gy-2">
          <div className="col-6 col-md-5 col-lg-3">
            <div className="logo d-flex align-items-center justify-content-around">
              <span>
                <h3 className="p-0 m-0">
                  <Link className="logo text-decoration-none font-quest dark-blue-text m-0 p-0" to={''} >
                    DAY{' '}
                    <span className="font-Rowdies main-orange-text">SOOQ</span>
                  </Link>{' '}
                </h3>
              </span>
            </div>
          </div>
          <div className="col-6 col-md-7 col-lg-6">
          <nav className="navbar navbar-expand-lg py-0">
            <div className="container w-75 mx-auto font-Poppins">
              <button
                className="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarSupportedContent"
                aria-controls="navbarSupportedContent"
                aria-expanded="false"
                aria-label="Toggle navigation"
              >
                <span className="navbar-toggler-icon">
                  <CiMenuBurger />
                </span>
              </button>
              <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul className="navbar-nav me-auto mb-2 mb-lg-0 d-flex align-items-center justify-content-around w-100">
                  <NavItem  name={'Categories'} to={'Categories'} activeLink={'Categories'} onClick={setActiveLink} />
                  <NavItem  name={'Brands'} to={'Brands'} activeLink={'Brands'} onClick={setActiveLink} />
                  <NavItem  name={'Bidding Products'} to={'Bidding Products'} activeLink={'Bidding Products'} onClick={setActiveLink} />
                  <NavItem  name={'Banners'} to={'Banners'} activeLink={'Banners'} onClick={setActiveLink} />
                  <NavItem  name={"Ad's"} to={"Ad's"} activeLink={"Ad's"} onClick={setActiveLink} />
                </ul>
              </div>
            </div>
          </nav>

          </div>
          <div className="col-12 col-md-5 col-lg-3">
            <div className="profileContainer d-flex align-items-center justify-content-center">
              {UserToken ? <>
              <span className='fs-6 dark-blue-text font-Rowdies me-3'>
                Hi, {data?.data.data.data.firstName}
              </span>
                <span className={`cursor-pointer profile-dropdown dropdown-toggle ${activeLink === '' ? ' active' : ''}`} id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  <Icon
                    size={22}
                    icon={androidPerson}
                    className="main-grey-text me-2 cursor-pointer"
                  ></Icon>
                </span>
                <div className="dropdown-menu profile-menu text-center font-Poppins" aria-labelledby="navbarDropdown">
                  <span className="nav-itemdropdown-menu text-center" aria-labelledby="navbarDropdown">
                    <Link className={`dropdown-item text-main ${activeLink === 'ProfileDetails' ? ' active' : ''}`} to={`ProfileDetails`} onClick={() => setActiveLink('ProfileDetails')}>
                    Profile Details
                    </Link>
                  </span>
                  <span className="nav-itemdropdown-menu text-center" aria-labelledby="navbarDropdown">
                    <Link className={`dropdown-item text-main${activeLink === 'ChangePassword' ? ' active' : ''}`} to={`ChangePassword`} onClick={() => setActiveLink('ChangePassword')} >
                    change Password
                    </Link>
                  </span>
                  <hr className='my-1'/>
                  <span className="nav-itemdropdown-menu text-center" aria-labelledby="navbarDropdown">
                    <Link className={`dropdown-item text-main`} onClick={Logout} >
                    Logout <FiLogOut className="fs-4 pb-1 cursor-pointer"/>
                    </Link>
                  </span>
                </div>
              </> :
                <span className='dark-blue-text cursor-pointer text-uppercase' onClick={()=> navigate('/Authorization')}>Have an Acount ?
                  <AiOutlineLogin size={22}  className="ms-1" />
                </span>}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
