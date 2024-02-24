import React, { useState } from 'react';
import { Icon } from 'react-icons-kit';
import { androidPerson } from 'react-icons-kit/ionicons/androidPerson';
import { FiLogOut } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ApiBaseUrl } from '../ApiBaseUrl';
import { AiOutlineLogin } from 'react-icons/ai';
import { useQuery } from 'react-query';
import { Sidebar } from 'primereact/sidebar';
import { RiAuctionLine } from "react-icons/ri";
export default function HeaderSearch({ UserToken, Logout }) {
  let navigate = useNavigate();

  const [visibleSidebar, setVisibleSidebar] = useState(false);
  const [activeLink, setActiveLink] = useState('');

  const user = localStorage.getItem('DaySooqDashUser');

  const headers = {
    Authorization: `Bearer ${user}`,
  };

  const getMyProfile = () => axios.get(ApiBaseUrl + `users/profile`, { headers });
  const { data } = useQuery('my-profile', getMyProfile, { cacheTime: 5000, enabled: !!user });

  const NavItem = ({ to, activeLink, onClick, name , icon }) => (
    <li className="nav-item">
      <Link
        to={to}
        className={`nav-link px-1 my-4 dark-grey-text ${activeLink === name ? 'active' : ''}`}
        onClick={() => {
          onClick(name);
        }}
      >
        {icon === 'auction' ? <RiAuctionLine className='me-2 fs-5'/> : <i className={`pi ${icon} me-2 fs-5`}></i> } {name}
      </Link>
    </li>
  );

  return (
    <>
      <Sidebar visible={visibleSidebar} onHide={() => setVisibleSidebar(false)}>
        <ul className="menu-items">
          <NavItem  to={'/'} activeLink={activeLink} onClick={setActiveLink} name={'Home'}  icon={'pi-home'}/>
          <NavItem  to={'Products/all'} activeLink={activeLink} onClick={setActiveLink} name={'All Products'} icon={'pi-box'} />
          <NavItem  to={'SubCategory/auction/6517dbc538001813b052bd73'} activeLink={activeLink} onClick={setActiveLink} name={'Bidding Products'} icon={'auction'} />
          <NavItem  to={'Categories'} activeLink={activeLink} onClick={setActiveLink} name={'Categories'} icon={'pi-th-large'} />
          <NavItem  to={'SubCategory/all'} activeLink={activeLink} onClick={setActiveLink} name={'SubCategories'} icon={'pi-sitemap'} />
          <NavItem  to={'Brands'} activeLink={activeLink} onClick={setActiveLink} name={'Brands'} icon={"pi-tags"}/>
          <NavItem  to={'Banners'} activeLink={activeLink} onClick={setActiveLink} name={'Banners'} icon={'pi-flag-fill'} />
          <NavItem  to={'Blogs'} activeLink={activeLink} onClick={setActiveLink} name={'Blogs'} icon={'pi-flag-fill'} />
          <NavItem  to={'AllOrders'} activeLink={activeLink} onClick={setActiveLink} name={'All Orders'} icon={'pi-truck'} />
          <NavItem  to={'Coupon'} activeLink={activeLink} onClick={setActiveLink} name={'Coupon'} icon={'pi-money-bill'} />
          <NavItem  to={'Users'} activeLink={activeLink} onClick={setActiveLink} name={'Users'} icon={'pi-users'}/>
          <Link className={`nav-link px-1 my-4 dark-grey-text`} onClick={Logout}>
             <FiLogOut className="fs-4 pb-1 cursor-pointer"/> Logout
          </Link>
        </ul>
      </Sidebar>
      <div className="search-header container-fluid mb-2 py-3 px-1 bg-light">
        <div className="row align-items-center gy-2">
          <div className="col-6 col-md-5 col-lg-3 d-flex">
          <button className="sidebar-toggle" onClick={() => setVisibleSidebar(!visibleSidebar)}>
            <i className='pi pi-align-justify mx-2 fs-4 p-1'></i>
          </button>
            <div className="logo d-flex align-items-center justify-content-around">
              <span>
                <h3 className="p-0 m-0">
                  <Link className="logo text-decoration-none font-quest dark-blue-text m-0 p-0" to={''}>
                    DAY <span className="font-Rowdies main-orange-text">SOOQ</span>
                  </Link>
                </h3>
              </span>
            </div>
          </div>
          <div className="col-6 col-md-7 col-lg-6">
            <nav className="navbar navbar-expand-lg py-0">
              <div className="w-75 mx-auto font-Poppins">
                {/* Navbar content */}
              </div>
            </nav>
          </div>
          <div className="col-12 col-md-5 col-lg-3">
            <div className="profileContainer d-flex align-items-center justify-content-center">
              {UserToken ? (
                <>
                  <span className={`cursor-pointer  ${activeLink === '' ? ' active' : ''}`} >
                    <Icon size={22} icon={androidPerson} className="main-grey-text me-2 mb-1 py-0 cursor-pointer"></Icon>
                  </span>
                  <span className="fs-6 dark-blue-text font-Rowdies me-3">Hi, {data?.data.data.data.firstName}</span>

                </>
              ) : (
                <span className="dark-blue-text cursor-pointer text-uppercase" onClick={() => navigate('/Authorization')}>
                  Login <AiOutlineLogin size={22} className="ms-1" />
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
