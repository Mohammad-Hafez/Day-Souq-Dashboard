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

  const getAllBiddings = () => axios.get(ApiBaseUrl + 'products?isAction=true&dashboard=true', { headers });
  const { data: biddingCount, isLoading: BiddingsLoading , error: biddingQuantityError } = useQuery('get Biddings', getAllBiddings, { cacheTime: 10000 });

  const getAllUsers = () => axios.get(ApiBaseUrl + 'users', { headers });
  const { data: userCount, isLoading: usersLoading } = useQuery('get users', getAllUsers, { cacheTime: 10000 });

  const getAllOrders = () => axios.get(ApiBaseUrl + 'orders', { headers });
  const { data: orderCount, isLoading: orderLoading , error: orderQuantityError } = useQuery('get orders', getAllOrders, { cacheTime: 10000 });


  const getProductsQuantity = () => axios.get(ApiBaseUrl + 'products', { headers });
  const { isLoading: productQuantityLoading, error: productQuantityError, data: productQuantityData } = useQuery(
    'productQuantity',
    getProductsQuantity,
    { cacheTime: 10000 }
  );

  return (
    <>
      <Helmet>
        <title>Home</title>
      </Helmet>
      {usersLoading || productQuantityLoading || BiddingsLoading || orderLoading? (
        <Loader/>
      ) : (
        <div className="container d-flex flex-column align-items-center text-center justify-content-center my-3">
          <h1 className="text-muted fs-3">
            Welcome In Day Sooq Dashboard
          </h1>
          <div className="homeContent w-100">
            <div className="row g-3">
              <div className="col-md-3">
                <div className="users shadow-sm rounded p-3 bg-light h-100 text-center">
                  <p className="numOfUsers fs-3 fw-bolder p-3 text-center rounded-circle mx-auto">{userCount?.data?.numOfDocs}</p>
                  <h3 className="fs-4 fw-bold my-2">Website Users</h3>
                </div>
              </div>
              <div className="col-md-3">
                {productQuantityError ? (
                  <span className="text-center">Error fetching product quantity</span>
                ) : (
                  <div className="products shadow-sm rounded p-3 bg-light h-100">
                    <p className="fs-3 productsQuantity fw-bolder p-3 text-center rounded-circle mx-auto">
                      {productQuantityData?.data?.numOfDocs}
                    </p>
                    <h3 className="fs-4 fw-bold my-2">Total Products</h3>
                  </div>
                )}
              </div>
              <div className="col-md-3">
                {orderQuantityError ? (
                  <span className="text-center">Error fetching orders quantity</span>
                ) : (
                  <div className="products shadow-sm rounded p-3 bg-light h-100">
                    <p className="fs-3 productsQuantity fw-bolder p-3 text-center rounded-circle mx-auto">
                      {orderCount?.data?.numOfDocs}
                    </p>
                    <h3 className="fs-4 fw-bold my-2">All orders</h3>
                  </div>
                )}
              </div>
              <div className="col-md-3">
                {biddingQuantityError ? (
                  <span className="text-center">Error fetching All Biddings quantity</span>
                ) : (
                  <div className="products shadow-sm rounded p-3 bg-light h-100">
                    <p className="fs-3 productsQuantity fw-bolder p-3 text-center rounded-circle mx-auto">
                      {biddingCount?.data?.numOfDocs}
                    </p>
                    <h3 className="fs-4 fw-bold my-2">Products on Auction Now</h3>
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
