import axios from 'axios';
import React from 'react';
import { Helmet } from 'react-helmet';
import { ApiBaseUrl } from '../ApiBaseUrl';
import { useQuery } from 'react-query';
import Loader from '../Loader/Loader';

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
          <h1 className="text-muted fs-3 text-uppercase mb-4">
            Day Sooq Dashboard
          </h1>
          <div className="homeContent w-100">
            <div className="row g-3">
              <div className="col-md-3">
              {StatisticsError ? (
                  <span className="text-center">Error fetching All Users quantity</span>
                ) : (
                <div className="users shadow-sm rounded p-3 bg-light h-100 text-center">
                  <p className="numOfUsers fs-3 fw-bolder p-3 text-center rounded-circle mx-auto">
                    {StatisticsData?.data.totalUsers}
                  </p> 
                  <h3 className="fs-4 fw-bold my-2">Website Users</h3>
                </div>
                )}
              </div>
              <div className="col-md-3">
                {StatisticsError ? (
                  <span className="text-center">Error fetching orders quantity</span>
                ) : (
                  <div className="products shadow-sm rounded p-3 bg-light h-100">
                    <p className="fs-3 productsQuantity fw-bolder p-3 text-center rounded-circle mx-auto">
                      {StatisticsData?.data.totalOrders} 
                    </p>
                    <h3 className="fs-4 fw-bold my-2">order</h3>
                  </div>
                )}
              </div>
              <div className="col-md-3">
                {StatisticsError ? (
                  <span className="text-center">Error fetching All Brands quantity</span>
                ) : (
                  <div className="products shadow-sm rounded p-3 bg-light h-100">
                    <p className="fs-3 productsQuantity fw-bolder p-3 text-center rounded-circle mx-auto">
                      {StatisticsData?.data.totalBrands}
                    </p>
                    <h3 className="fs-4 fw-bold my-2">brand</h3>
                  </div>
                )}
              </div>
              <div className="col-md-3">
                {StatisticsError ? (
                  <span className="text-center">Error fetching All Categories quantity</span>
                ) : (
                  <div className="products shadow-sm rounded p-3 bg-light h-100">
                    <p className="fs-3 productsQuantity fw-bolder p-3 text-center rounded-circle mx-auto">
                      {StatisticsData?.data.totalCategories}
                    </p>
                    <h3 className="fs-4 fw-bold my-2">Category</h3>
                  </div>
                )}
              </div>
              <div className="col-md-3">
                {StatisticsError ? (
                  <span className="text-center">Error fetching All Subcategories quantity</span>
                ) : (
                  <div className="products shadow-sm rounded p-3 bg-light h-100">
                    <p className="fs-3 productsQuantity fw-bolder p-3 text-center rounded-circle mx-auto">
                      {StatisticsData?.data.totalSubCategories}
                    </p>
                    <h3 className="fs-4 fw-bold my-2">SubCategory</h3>
                  </div>
                )}
              </div>
              <div className="col-md-3">
                {StatisticsError ? (
                  <span className="text-center">Error fetching product quantity</span>
                ) : (
                  <div className="products shadow-sm rounded p-3 bg-light h-100">
                    <p className="fs-3 productsQuantity fw-bolder p-3 text-center rounded-circle mx-auto">
                      {StatisticsData?.data.totalProducts}
                    </p>
                    <h3 className="fs-4 fw-bold my-2">Total Products</h3>
                  </div>
                )}
              </div>
              <div className="col-md-3">
                {StatisticsError ? (
                  <span className="text-center">Error fetching All Biddings quantity</span>
                ) : (
                  <div className="products shadow-sm rounded p-3 bg-light h-100">
                    <p className="fs-3 productsQuantity fw-bolder p-3 text-center rounded-circle mx-auto">
                      {StatisticsData?.data.totalProductsAuction}
                    </p>
                    <h3 className="fs-4 fw-bold my-2">All Time Auction</h3>
                  </div>
                )}
              </div>
              <div className="col-md-3">
                {StatisticsError ? (
                  <span className="text-center">Error fetching All Biddings quantity</span>
                ) : (
                  <div className="products shadow-sm rounded p-3 bg-light h-100">
                    <p className="fs-3 productsQuantity fw-bolder p-3 text-center rounded-circle mx-auto">
                      {StatisticsData && StatisticsData.data.auctionProducts.find(item => item._id === 'ended') ? StatisticsData.data.auctionProducts.find(item => item._id === 'ended').total : 0}
                    </p>
                    <h3 className="fs-4 fw-bold my-2">Ended Auction</h3>
                  </div>
                )}
              </div>
              <div className="col-md-3">
                {StatisticsError ? (
                  <span className="text-center">Error fetching All Biddings quantity</span>
                ) : (
                  <div className="products shadow-sm rounded p-3 bg-light h-100">
                    <p className="fs-3 productsQuantity fw-bolder p-3 text-center rounded-circle mx-auto">
                      {StatisticsData && StatisticsData.data.auctionProducts.find(item => item._id === 'start') ? StatisticsData.data.auctionProducts.find(item => item._id === 'start').total : 0}
                    </p>
                    <h3 className="fs-4 fw-bold my-2">Current Auction</h3>
                  </div>
                )}
              </div>
              <div className="col-md-3">
                {StatisticsError ? (
                  <span className="text-center">Error fetching All Biddings quantity</span>
                ) : (
                  <div className="products shadow-sm rounded p-3 bg-light h-100">
                    <p className="fs-3 productsQuantity fw-bolder p-3 text-center rounded-circle mx-auto">
                      {StatisticsData && StatisticsData.data.auctionProducts.find(item => item._id === 'pending') ? StatisticsData.data.auctionProducts.find(item => item._id === 'pending').total : 0}
                    </p>
                    <h3 className="fs-4 fw-bold my-2">Upcoming Auction</h3>
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
