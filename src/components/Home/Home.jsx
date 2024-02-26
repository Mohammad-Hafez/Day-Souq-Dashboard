import axios from 'axios';
import React from 'react';
import { Helmet } from 'react-helmet';
import { ApiBaseUrl } from '../ApiBaseUrl';
import { useQuery } from 'react-query';
import Loader from '../Loader/Loader';
import { FaPeopleCarryBox } from "react-icons/fa6";
import { BsTags } from "react-icons/bs";
import { BiCategoryAlt } from "react-icons/bi";
import { TbSitemap } from "react-icons/tb";
import { FaBoxOpen } from "react-icons/fa";
import { RiAuctionLine } from "react-icons/ri";
import { RiAuctionFill } from "react-icons/ri";
import { TbCalendarTime } from "react-icons/tb";
import { RxLapTimer } from "react-icons/rx";

import { PiUsersThree } from "react-icons/pi";
export default function Home() {
  const user = localStorage.getItem('DaySooqDashUser');
  const headers = {
    Authorization: `Bearer ${user}`,
  };

  const getStatistics = () => axios.get(ApiBaseUrl + 'statistics', { headers });
  const { isLoading: StatisticsLoading, error: StatisticsError, data: StatisticsData } = useQuery(
    'Statistics',
    getStatistics,
    { cacheTime: 10000 }
  );
  return (
    <>
      <Helmet>
        <title>Home</title>
      </Helmet>
      { StatisticsLoading ? (
        <Loader/>
      ) : (
        <div className="container d-flex flex-column align-items-center text-center justify-content-center my-3">
          <h1 className="text-muted fs-3 text-uppercase mb-4 font-quest">
            Day Sooq Dashboard
          </h1>
          <div className="homeContent font-roboto w-100">
            <div className="row g-3">
              <div className="col-md-4">
              {StatisticsError ? <span className="text-center">Error fetching All Users quantity</span>
                : 
                <div className="users shadow-sm rounded p-3 bg-light h-100 text-center d-flex justify-content-start align-items-center">
                  <div className="usersIcon rounded p-2">
                    <PiUsersThree size={60} />
                  </div> 
                  <div className="usersNum w-75 ms-auto text-center">
                    <p className="fs-4 fw-bolder text-center rounded-circle mx-auto">
                      + {StatisticsData?.data.totalUsers}
                    </p> 
                    <h4 className="my-2">Website Users</h4>
                  </div>
                </div>
                }
              </div>
              <div className="col-md-4">
                {StatisticsError ?  <span className="text-center">Error fetching orders quantity</span>
                 : <div className="users shadow-sm rounded p-3 bg-light h-100 text-center d-flex justify-content-start align-items-center">
                 <div className="OrderIcon rounded p-2">
                   <FaPeopleCarryBox size={60} />
                 </div> 
                 <div className="usersNum w-75 ms-auto text-center">
                   <p className="fs-4 fw-bolder text-center rounded-circle mx-auto">
                     + {StatisticsData?.data.totalOrders}
                   </p> 
                   <h4 className="my-2">order</h4>
                 </div>
               </div>
                }
              </div>
              <div className="col-md-4">
                {StatisticsError ? (
                  <span className="text-center">Error fetching All Brands quantity</span>
                ) : (
                  <div className="users shadow-sm rounded p-3 bg-light h-100 text-center d-flex justify-content-start align-items-center">
                 <div className="BrandsIcon rounded p-2">
                   <BsTags size={60} />
                 </div> 
                 <div className="usersNum w-75 ms-auto text-center">
                   <p className="fs-4 fw-bolder text-center rounded-circle mx-auto">
                     + {StatisticsData?.data.totalBrands}
                   </p> 
                   <h4 className="my-2">brand</h4>
                 </div>
               </div>
                )}
              </div>
              <div className="col-md-4">
                {StatisticsError ? (
                  <span className="text-center">Error fetching All Categories quantity</span>
                ) : (
                  <div className="users shadow-sm rounded p-3 bg-light h-100 text-center d-flex justify-content-start align-items-center">
                  <div className="usersIcon rounded p-2">
                    <BiCategoryAlt size={60} />
                  </div> 
                  <div className="usersNum w-75 ms-auto text-center">
                    <p className="fs-4 fw-bolder text-center rounded-circle mx-auto">
                      + {StatisticsData?.data.totalCategories}
                    </p> 
                    <h4 className="my-2">Category</h4>
                  </div>
                </div>
 
                )}
              </div>
              <div className="col-md-4">
                {StatisticsError ? (
                  <span className="text-center">Error fetching All Subcategories quantity</span>
                ) : (
                  <div className="users shadow-sm rounded p-3 bg-light h-100 text-center d-flex justify-content-start align-items-center">
                  <div className="usersIcon rounded p-2">
                    <TbSitemap size={60} />
                  </div> 
                  <div className="usersNum w-75 ms-auto text-center">
                    <p className="fs-4 fw-bolder text-center rounded-circle mx-auto">
                      + {StatisticsData?.data.totalSubCategories}
                    </p> 
                    <h4 className="my-2">SubCategory</h4>
                  </div>
                </div>
                )}
              </div>
              <div className="col-md-4">
                {StatisticsError ? (
                  <span className="text-center">Error fetching product quantity</span>
                ) : (
                  <div className="users shadow-sm rounded p-3 bg-light h-100 text-center d-flex justify-content-start align-items-center">
                  <div className="usersIcon rounded p-2">
                    <FaBoxOpen size={60} />
                  </div> 
                  <div className="usersNum w-75 ms-auto text-center">
                    <p className="fs-4 fw-bolder text-center rounded-circle mx-auto">
                      + {StatisticsData?.data.totalProducts}
                    </p> 
                    <h4 className="my-2">Total Products</h4>
                  </div>
                </div>
                )}
              </div>
              <div className="col-md-4">
                {StatisticsError ? (
                  <span className="text-center">Error fetching All Biddings quantity</span>
                ) : (
                  <div className="users shadow-sm rounded p-3 bg-light h-100 text-center d-flex justify-content-start align-items-center">
                  <div className="usersIcon rounded p-2">
                    <RiAuctionLine size={60} />
                  </div> 
                  <div className="usersNum w-75 ms-auto text-center">
                    <p className="fs-4 fw-bolder text-center rounded-circle mx-auto">
                      + {StatisticsData?.data.totalProductsAuction}
                    </p> 
                    <h4 className="my-2">All Time Auction</h4>
                  </div>
                </div>
                )}
              </div>
              <div className="col-md-4">
                {StatisticsError ? (
                  <span className="text-center">Error fetching All Biddings quantity</span>
                ) : (
                  <div className="users shadow-sm rounded p-3 bg-light h-100 text-center d-flex justify-content-start align-items-center">
                  <div className="usersIcon rounded p-2">
                    <RiAuctionFill size={60} />
                  </div> 
                  <div className="usersNum w-75 ms-auto text-center">
                    <p className="fs-4 fw-bolder text-center rounded-circle mx-auto">
                      +   {StatisticsData && StatisticsData.data.auctionProducts.find(item => item._id === 'ended') ? StatisticsData.data.auctionProducts.find(item => item._id === 'ended').total : 0}

                    </p> 
                    <h4 className="my-2">Ended Auction</h4>
                  </div>
                </div>
                )}
              </div>
              <div className="col-md-4">
                {StatisticsError ? (
                  <span className="text-center">Error fetching All Biddings quantity</span>
                ) : (
                  <div className="users shadow-sm rounded p-3 bg-light h-100 text-center d-flex justify-content-start align-items-center">
                  <div className="usersIcon rounded p-2">
                    <RxLapTimer size={60} />
                  </div> 
                  <div className="usersNum w-75 ms-auto text-center">
                    <p className="fs-4 fw-bolder text-center rounded-circle mx-auto">
                     + {StatisticsData && StatisticsData.data.auctionProducts.find(item => item._id === 'start') ? StatisticsData.data.auctionProducts.find(item => item._id === 'start').total : 0}

                    </p> 
                    <h4 className="my-2">Current Auction</h4>
                  </div>
                </div>

                )}
              </div>
              <div className="col-md-4">
                {StatisticsError ? (
                  <span className="text-center">Error fetching All Biddings quantity</span>
                ) : (
                  <div className="users shadow-sm rounded p-3 bg-light h-100 text-center d-flex justify-content-start align-items-center">
                  <div className="usersIcon rounded p-2">
                    <TbCalendarTime size={60} />
                  </div> 
                  <div className="usersNum w-75 ms-auto text-center">
                    <p className="fs-4 fw-bolder text-center rounded-circle mx-auto">
                      + {StatisticsData && StatisticsData.data.auctionProducts.find(item => item._id === 'pending') ? StatisticsData.data.auctionProducts.find(item => item._id === 'pending').total : 0}

                    </p> 
                    <h4 className="my-2">Upcoming Auction</h4>
                  </div>
                </div>
                )}
              </div>

            </div>
          </div>
        </div>
      )}
    </>
  );
}
