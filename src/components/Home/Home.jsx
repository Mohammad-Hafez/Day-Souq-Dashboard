import axios from 'axios';
import React from 'react';
import { Helmet } from 'react-helmet';
import { ApiBaseUrl } from '../ApiBaseUrl';
import { useQuery } from 'react-query';

export default function Home() {
  const user = localStorage.getItem('DaySooqDashUser');
  const headers = {
    Authorization: `Bearer ${user}`,
  };

  const getAllUsers = () => axios.get(ApiBaseUrl + 'users', { headers });
  const { data: userCount, isLoading: usersLoading } = useQuery('get users', getAllUsers, { cacheTime: 10000 });

  const getProductsQuantity = () => axios.get(ApiBaseUrl + 'products', { headers });
  const { isLoading: productQuantityLoading, error: productQuantityError, data: productQuantityData } = useQuery(
    'productQuantity',
    getProductsQuantity,
    { cacheTime: 10000 }
  );

  return (
    <>
      <Helmet>
        <title>title</title>
      </Helmet>
      {usersLoading || productQuantityLoading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <div className="container d-flex flex-column align-items-center text-center justify-content-center my-3">
          <h1 className="text-muted fs-3">
            Welcome In Day Sooq Dashboard
          </h1>
          <div className="homeContent w-100">
            <div className="row">
              <div className="col-md-6">
                <div className="users shadow-sm rounded p-3 bg-light h-100 text-center">
                  <p className="numOfUsers fs-3 fw-bolder p-3 text-center rounded-circle mx-auto">{userCount?.data?.numOfDocs}</p>
                  <h3 className="fs-4 fw-bold my-2">Website Users</h3>
                </div>
              </div>
              <div className="col-md-6">
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
            </div>
          </div>
        </div>
      )}
    </>
  );
}
