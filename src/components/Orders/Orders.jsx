import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import axios from 'axios';
import { ApiBaseUrl } from '../ApiBaseUrl';
import { useQuery } from 'react-query';
import Loader from '../Loader/Loader';

export default function Orders() {
  const user = localStorage.getItem("DaySooqDashUser") ;
  let headers = { 'Authorization': `Bearer ${user}` };

  const [LoaderBtn, setLoaderBtn] = useState(false);
  const [SelectedOrders, setSelectedOrders] = useState(null);
  const [displayDeleteDialog, setDisplayDeleteDialog] = useState(false);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [AllOrders, setAllOrders] = useState([]);
  const [searchValue, setSearchValue] = useState('');

  const getAllOrders = ()=> axios.get( ApiBaseUrl + `orders?dashboard=true`,{headers});
  let { data: AllOrdersResponse, isLoading: AllOrdersLoading, refetch: AllOrdersRefetch } = useQuery(
    'All-Orders',
    getAllOrders,
    { cacheTime: 50000 }
  );

  useEffect(()=>{
    if (AllOrdersResponse) {
      setAllOrders(AllOrdersResponse?.data.data.data)
      setFilteredOrders(AllOrdersResponse?.data.data.data)
    }
  },[AllOrdersResponse])

  const handleSearch = (e) => {
    const inputValue = e.target.value.trim();
    setSearchValue(inputValue);
    const filteredData = AllOrders.filter(
      (order) => order.phone.toLowerCase().startsWith(inputValue) 
    );
    setFilteredOrders(filteredData);
  };

  const deleteOrder = async (id) => {
    setLoaderBtn(true);
    try {
      await axios.delete(ApiBaseUrl + `orders/${id}`, {headers});
      AllOrdersRefetch();
      hideDialog();
    } catch (error) {
      console.error(error);
    } finally {
      setLoaderBtn(false);
    }
  };

  const hideDialog = () => {
    setDisplayDeleteDialog(false);
    setSelectedOrders(null);
  };

  const actionTemplate = (rowData) => {
    return (
      <div className='d-flex justify-content-center align-items-center'>
        <Button icon="pi pi-trash" className='TabelButton Cancel rounded-circle mx-1' onClick={() => { setDisplayDeleteDialog(true); setSelectedOrders(rowData._id) }} />
      </div>
    );
  };

  const dateBody = (rowData) => <span>{rowData?.createdAt?.slice(0, 10)}</span>;

  const OrdersHeader = ()=>{
    return(
      <div className='d-flex align-items-center justify-content-between'>
        <div className="headerLabel">
          <h3>
            All Orders
          </h3>
        </div>
        <div className="p-inputgroup w-auto">
          <span className="p-inputgroup-addon">
            <i className="pi pi-search" />
          </span>
          <input type="text" className="p-inputtext rounded-start-0" placeholder="Search by phone number" value={searchValue} onChange={handleSearch} />
        </div>
      </div>
  )

  }
  return <>
      <Helmet>
        <title>All Orders</title>
      </Helmet>
      {AllOrdersLoading ? <Loader />  : 
        <div className="container-fluid">
          <DataTable
            value={filteredOrders}
            header={OrdersHeader}
            paginator
            selectionMode="single"
            className={`dataTabel mb-4 text-capitalize AllList`}
            dataKey="_id"
            scrollable
            scrollHeight="calc(100vh - 200px)"
            tableStyle={{ minWidth: "50rem" }}
            rows={10}
            responsive="scroll"
          >
        <Column header="user" field='user' style={{ width: "10%", borderBottom: '1px solid #dee2e6' }} />
        <Column header="code" field='code' style={{ width: "10%", borderBottom: '1px solid #dee2e6' }} />
        <Column header="total Price" field='totalPrice' style={{ width: "10%", borderBottom: '1px solid #dee2e6' }} />
        <Column header="shipping" field='shipping_cost' style={{ width: "10%", borderBottom: '1px solid #dee2e6' }} />
        <Column header="phone" field='phone' style={{ width: "10%", borderBottom: '1px solid #dee2e6' }} />
        <Column header="payment Method" field='paymentMethod' style={{ width: "10%", borderBottom: '1px solid #dee2e6' }} />
        <Column header="Date" body={dateBody} style={{ width: "10%", borderBottom: '1px solid #dee2e6' }} />
        <Column header="city" field='city' style={{ width: "10%", borderBottom: '1px solid #dee2e6' }} />
        <Column header="done" field='isPay' style={{ width: "10%", borderBottom: '1px solid #dee2e6' }} />
        <Column header="country" field='country' style={{ width: "10%", borderBottom: '1px solid #dee2e6' }} />
        <Column header="Delete" body={actionTemplate}  style={{ width: "10%", borderBottom: '1px solid #dee2e6' }} />
        </DataTable>
        <Dialog header={'Delete Banner'} className='container editDialog' visible={displayDeleteDialog} onHide={hideDialog} modal>
        <h5>you want delete this Order ?</h5>
        <hr />
        <div className="d-flex align-items-center justify-content-around">
        {LoaderBtn ? <button className='btn btn-danger  w-50 mx-2 px-4' disabled><i className='fa fa-spin fa-spinner'></i></button>: 
        <button className='btn btn-danger  w-50 mx-2 px-4' onClick={()=>{deleteOrder(SelectedOrders)}}>Yes</button>}
        <button className='btn btn-primary w-50 mx-2  px-4' onClick={()=>{setDisplayDeleteDialog(false)}}>No</button>
        </div>
      </Dialog>  

      </div>
    }
    </>
}
