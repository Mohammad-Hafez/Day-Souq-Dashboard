import React, { useState } from 'react';
import { Icon } from 'react-icons-kit';
import { androidPerson } from 'react-icons-kit/ionicons/androidPerson';
import { FiLogOut } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { ApiBaseUrl } from '../ApiBaseUrl';
import { useQuery } from 'react-query';
import { Sidebar } from 'primereact/sidebar';
import { RiAuctionLine } from "react-icons/ri";
import logo from '../../assets/Logo daysooq V09.png'
export default function HeaderSearch({ UserToken, Logout }) {

  const [visibleSidebar, setVisibleSidebar] = useState(false);
  const [activeLink, setActiveLink] = useState('');

  const user = localStorage.getItem('DaySooqDashUser');

  const headers = {
    Authorization: `Bearer ${user}`,
  };

  const getMyProfile = () => axios.get(ApiBaseUrl + `users/profile`, { headers });
  const { data } = useQuery('my-profile', getMyProfile, { cacheTime: 5000, enabled: !!user });

  const NavItem = ({ to, activeLink, onClick, name , icon }) => (
    <li className="nav-item border-0 border-bottom w-100">
      <Link
        to={to}
        className={`nav-link fw-bolder fs-6 px-1 my-4 dark-grey-text ${activeLink === name ? 'active' : ''}`}
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
        <ul className="menu-items font-Poppins">
          <NavItem  to={'/'} activeLink={activeLink} onClick={setActiveLink} name={'Home'}  icon={'pi-home'}/>
          <NavItem  to={'Products/all/all/all'} activeLink={activeLink} onClick={setActiveLink} name={'All Products'} icon={'pi-box'} />
          <NavItem  to={'Products/category/auction/6517dbc538001813b052bd73'} activeLink={activeLink} onClick={setActiveLink} name={'Bidding Products'} icon={'auction'} />
          <NavItem  to={'Categories'} activeLink={activeLink} onClick={setActiveLink} name={'Categories'} icon={'pi-th-large'} />
          <NavItem  to={'SubCategory/all'} activeLink={activeLink} onClick={setActiveLink} name={'SubCategories'} icon={'pi-sitemap'} />
          <NavItem  to={'Brands'} activeLink={activeLink} onClick={setActiveLink} name={'Brands'} icon={"pi-tags"}/>
          <NavItem  to={'Banners'} activeLink={activeLink} onClick={setActiveLink} name={'Banners'} icon={'pi-flag-fill'} />
          <NavItem  to={'Blogs'} activeLink={activeLink} onClick={setActiveLink} name={'Blogs'} icon={'pi-file-edit'} />
          <NavItem  to={'Orders'} activeLink={activeLink} onClick={setActiveLink} name={'All Orders'} icon={'pi-inbox'} />
          <NavItem  to={'Shipping'} activeLink={activeLink} onClick={setActiveLink} name={'Shipping'} icon={'pi-truck'} />
          <NavItem  to={'Coupons'} activeLink={activeLink} onClick={setActiveLink} name={'Coupon'} icon={'pi-money-bill'} />
          <NavItem  to={'Users'} activeLink={activeLink} onClick={setActiveLink} name={'Users & notifications'} icon={'pi-users'}/>
          <Link className={`nav-link px-1 my-4 dark-grey-text fw-bolder`} onClick={()=>{Logout(); setVisibleSidebar(!visibleSidebar)}}>
              <FiLogOut className="fs-4 pb-1 cursor-pointer"/> Logout
          </Link>
        </ul>
      </Sidebar>
      <div className="search-header container-fluid py-3 px-1 ">
        <div className="row align-items-center gy-2">
          <div className="col-6 col-md-5 col-lg-3 d-flex">
            {user ?           <button className="sidebar-toggle" onClick={() => setVisibleSidebar(!visibleSidebar)}>
            <i className='pi pi-align-justify mx-2 fs-4 p-1'></i>
          </button>
          : null}
            <div className="logo d-flex align-items-center justify-content-around ms-2">
              <span>
                <h3 className="p-0 m-0">
                  <Link className="logo text-decoration-none font-quest dark-blue-text m-0 p-0" to={''}>
                    <img src={logo} className='w-50' alt="logo" />
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
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
