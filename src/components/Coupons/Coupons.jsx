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

export default function Coupons() {
  const user = localStorage.getItem("DaySooqDashUser") ;
  let headers = { 'Authorization': `Bearer ${user}` };

  const [LoaderBtn, setLoaderBtn] = useState(false);
  const [SelectedCoupons, setSelectedCoupons] = useState(null);
  const [displayDeleteDialog, setDisplayDeleteDialog] = useState(false);
  const [filteredCoupons, setFilteredCoupons] = useState([]);
  const [AllCoupons, setAllCoupons] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [ErrMsg, setErrMsg] = useState(null)

  const getAllCoupons = ()=> axios.get( ApiBaseUrl + `Coupons`,{headers});
  let { data: AllCouponsResponse, isLoading: AllCouponsLoading, refetch: AllCouponsRefetch } = useQuery(
    'All-Coupons',
    getAllCoupons,
    { cacheTime: 50000 }
  );

  useEffect(()=>{
    if (AllCouponsResponse) {
      setAllCoupons(AllCouponsResponse?.data.data.data)
      setFilteredCoupons(AllCouponsResponse?.data.data.data)
    }
  },[AllCouponsResponse])

  const handleSearch = (e) => {
    const inputValue = e.target.value.trim();
    setSearchValue(inputValue);
    const filteredData = AllCoupons.filter(
      (Coupon) => Coupon.promoCode.toLowerCase().startsWith(inputValue) 
    );
    setFilteredCoupons(filteredData);
  };

  const deleteCoupon = async (id) => {
    setLoaderBtn(true);
      await axios.delete(ApiBaseUrl + `Coupons/${id}`, {headers})
      .then(response => {
      AllCouponsRefetch();
      hideDialog();
      setLoaderBtn(false);
    }).catch (error=> {
      console.error(error);
      setLoaderBtn(false);
    }) 
  };

  const hideDialog = () => {
    setDisplayDeleteDialog(false);
    setSelectedCoupons(null);
  };

  const actionTemplate = (rowData) => {
    return (
      <div className='d-flex justify-content-center align-items-center'>
        <Button icon="pi pi-trash" className='TabelButton Cancel rounded-circle mx-1' onClick={() => { setDisplayDeleteDialog(true); setSelectedCoupons(rowData._id) }} />
      </div>
    );
  };

  const dateBody = (rowData) => <span>{rowData?.expireDate?.slice(0, 10)}</span>;

  const typeBody = (rowData) => <span>{rowData?.discount?.type}</span>;

  const valueBody = (rowData) => <span>{rowData?.discount?.value} {rowData?.discount?.type === 'fixed' ? "JOD" : "%"}</span>;

  const CouponsHeader = ()=>{
    return(
      <div className='d-flex align-items-center justify-content-between'>
        <div className="headerLabel">
          <h3>
            All Coupons
          </h3>
        </div>
        <div className="p-inputgroup w-auto">
          <span className="p-inputgroup-addon">
            <i className="pi pi-search" />
          </span>
          <input type="text" className="p-inputtext rounded-start-0" placeholder="Search by promoCode" value={searchValue} onChange={handleSearch} />
        </div>
      </div>
  )

  }
  return <>
      <Helmet>
        <title>All Coupons</title>
      </Helmet>
      {AllCouponsLoading ? <Loader />  : 
        <div className="container">
          <DataTable
            value={filteredCoupons}
            header={CouponsHeader}
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
        <Column header="promoCode" field='promoCode' style={{ width: "10%", bCouponBottom: '1px solid #dee2e6' }} />
        <Column header="_id" field='_id' style={{ width: "10%", bCouponBottom: '1px solid #dee2e6' }} />
        <Column header="type" body={typeBody} style={{ width: "10%", bCouponBottom: '1px solid #dee2e6' }} />
        <Column header="value" body={valueBody} style={{ width: "10%", bCouponBottom: '1px solid #dee2e6' }} />
        <Column header="expireDate" body={dateBody} style={{ width: "10%", bCouponBottom: '1px solid #dee2e6' }} />
        <Column header="isActive" field='isActive' style={{ width: "10%", bCouponBottom: '1px solid #dee2e6' }} />
        <Column header="Delete" body={actionTemplate}  style={{ width: "10%", bCouponBottom: '1px solid #dee2e6' }} />
        </DataTable>
        <Dialog header={'Delete Banner'} className='container editDialog' visible={displayDeleteDialog} onHide={hideDialog} modal>
        <h5>you want delete this Coupon ?</h5>
        <hr />
        <div className="d-flex align-items-center justify-content-around">
        {LoaderBtn ? <button className='btn btn-danger  w-50 mx-2 px-4' disabled><i className='fa fa-spin fa-spinner'></i></button>: 
        <button className='btn btn-danger  w-50 mx-2 px-4' onClick={()=>{deleteCoupon(SelectedCoupons)}}>Yes</button>}
        <button className='btn btn-primary w-50 mx-2  px-4' onClick={()=>{setDisplayDeleteDialog(false)}}>No</button>
        </div>
      </Dialog>  

      </div>
    }
    </>
}
