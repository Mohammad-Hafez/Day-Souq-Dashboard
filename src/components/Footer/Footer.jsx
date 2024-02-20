import React from 'react'
import { Icon } from 'react-icons-kit'
import {socialTwitter} from 'react-icons-kit/ionicons/socialTwitter' ;
import {facebook_1} from 'react-icons-kit/ikons/facebook_1';
import {youtube} from 'react-icons-kit/ikons/youtube'
import {instagram} from 'react-icons-kit/entypo/instagram'
import { Link } from 'react-router-dom';

export default function Footer() {
  return <>
  <div className="footer rounded-top">
    <div className="container ">
      <div className="row">
        <div className="col-12 col-md-6">
          <div className="footer-item p-4 text-start">
            <div className="logo mb-3">
              <span><h3 className='p-0 m-0 logo text-decoration-none font-quest dark-blue-text'> DAY <span className='font-Rowdies main-orange-text'>SOOQ</span> </h3></span> 
            </div>
            <h6 className='dark-grey-text'>Address</h6>
            <p className='main-grey-text'>street, area Name, Jordan</p>
            <h6 className='dark-grey-text'>Email</h6>
            <p className='main-grey-text'>
              <a href="mailto:contact@electrobilesouq.com" className="text-decoration-none">
                contact@electrobilesouq.com
              </a>
            </p>
            <h6 className='dark-grey-text'>Telephone</h6>
            <p className='main-grey-text'>
              <a href="tel:+000000000" className="tel-link text-decoration-none">
                (+00) 000 000 000
              </a>
            </p>
            <div className="social light-grey-text">
              <span><Icon className='mx-1 cursor-pointer' icon={facebook_1} size={16}></Icon></span>
              <span><Icon className='mx-1 cursor-pointer' icon={instagram} size={16}></Icon></span>
              <span><Icon className='mx-1 cursor-pointer' icon={socialTwitter} size={16}></Icon></span>
              <span><Icon className='mx-1 cursor-pointer' icon={youtube} size={16}></Icon></span>
            </div>
          </div>  
        </div>
        <div className="col-4 col-md-2">
          <div className="footer-item p-4 text-start">
            <h6 className='dark-grey-text'>Categories</h6>
            <Link to={''} className='main-grey-text text-decoration-none my-2 d-block'>TV & Audio</Link>
            <Link to={''} className='main-grey-text text-decoration-none my-2 d-block'>Smartphones</Link>
            <Link to={''} className='main-grey-text text-decoration-none my-2 d-block'>Laptops & PCs</Link>
            <Link to={''} className='main-grey-text text-decoration-none my-2 d-block'>Gadgets</Link>
            <Link to={''} className='main-grey-text text-decoration-none my-2 d-block'>Photo & Video</Link>
            <Link to={''} className='main-grey-text text-decoration-none my-2 d-block'>Gifts</Link>
            <Link to={''} className='main-grey-text text-decoration-none my-2 d-block'>Books</Link>
            <Link to={''} className='main-grey-text text-decoration-none my-2 d-block'>Toys</Link>
          </div>
        </div>
        <div className="col-4 col-md-2">
          <div className="footer-item p-4 text-start">
            <h6 className='dark-grey-text'>Useful Links</h6>
            <Link to={''} className='main-grey-text text-decoration-none my-2 d-block'>About</Link>
            <Link to={''} className='main-grey-text text-decoration-none my-2 d-block'>Contact</Link>
            <Link to={''} className='main-grey-text text-decoration-none my-2 d-block'>Wishlist</Link>
            <Link to={''} className='main-grey-text text-decoration-none my-2 d-block'>FAQ</Link>
            <Link to={''} className='main-grey-text text-decoration-none my-2 d-block'>Terms & Conditions</Link>
            <Link to={''} className='main-grey-text text-decoration-none my-2 d-block'>Privacy Policy</Link>
          </div>
        </div>
        <div className="col-4 col-md-2">
          <div className="footer-item p-4 text-start">
            <h6 className='dark-grey-text'>Customer Service</h6>
            <Link to={''} className='main-grey-text text-decoration-none my-2 d-block'>My Account</Link>
            <Link to={''} className='main-grey-text text-decoration-none my-2 d-block'>My Cart</Link>
          </div>
        </div>
      </div>
      <div className="copyright w-100 text-center pb-2">
        <span className='main-grey-text my-0'>© Electrobile Souq 2024 - ALL Rights Reserved </span>
      </div>
    </div>
  </div>
    </>
}
