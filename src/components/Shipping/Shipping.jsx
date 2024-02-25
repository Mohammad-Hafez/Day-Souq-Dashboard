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

export default function Shipping() {
  const user = localStorage.getItem("DaySooqDashUser") ;
  let headers = { 'Authorization': `Bearer ${user}` };

  const [LoaderBtn, setLoaderBtn] = useState(false);
  const [SelectedShippings, setSelectedShippings] = useState(null);
  const [displayDeleteDialog, setDisplayDeleteDialog] = useState(false);
  const [AllShippings, setAllShippings] = useState([]);
  const [searchValue, setSearchValue] = useState('');

  const getAllShippings = ()=> axios.get( ApiBaseUrl + `Shippings`,{headers});
  let { data: AllShippingsResponse, isLoading: AllShippingsLoading, refetch: AllShippingsRefetch } = useQuery(
    'All-Shippings',
    getAllShippings,
    { cacheTime: 50000 }
  );

  useEffect(()=>{
    if (AllShippingsResponse) {
      console.log(AllShippingsResponse?.data.shippingRates);
      setAllShippings(AllShippingsResponse?.data.shippingRates)
    }
  },[AllShippingsResponse])


  const deleteShipping = async (id) => {
    setLoaderBtn(true);
    try {
      await axios.delete(ApiBaseUrl + `Shippings/${id}`, {headers});
      AllShippingsRefetch();
      hideDialog();
    } catch (error) {
      console.error(error);
    } finally {
      setLoaderBtn(false);
    }
  };

  const hideDialog = () => {
    setDisplayDeleteDialog(false);
    setSelectedShippings(null);
  };

  const actionTemplate = (rowData) => {
    return (
      <div className='d-flex justify-content-center align-items-center'>
        <Button icon="pi pi-trash" className='TabelButton Cancel rounded-circle mx-1' onClick={() => { setDisplayDeleteDialog(true); setSelectedShippings(rowData._id) }} />
      </div>
    );
  };

  const ShippingsHeader = ()=>{
    return(
      <div className='d-flex align-items-center justify-content-between'>
        <div className="headerLabel">
          <h3>
            All Shippings
          </h3>
        </div>
      </div>
  )

  }
  return <>
      <Helmet>
        <title>All Shippings</title>
      </Helmet>
      {AllShippingsLoading ? <Loader />  : 
        <div className="container">
          <DataTable
            value={AllShippings}
            header={ShippingsHeader}
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
        <Column header="name" field='name' style={{ width: "10%", bShippingBottom: '1px solid #dee2e6' }} />
        <Column header="amount" field='amount' style={{ width: "10%", bShippingBottom: '1px solid #dee2e6' }} />
        <Column header="max_price (JOD)" field='max_price' style={{ width: "10%", bShippingBottom: '1px solid #dee2e6' }} />
        {/* <Column header="delivery_estimate" field='delivery_estimate' style={{ width: "10%", bShippingBottom: '1px solid #dee2e6' }} /> */}
        <Column header="Delete" body={actionTemplate}  style={{ width: "10%", bShippingBottom: '1px solid #dee2e6' }} />
        </DataTable>
        <Dialog header={'Delete Banner'} className='container editDialog' visible={displayDeleteDialog} onHide={hideDialog} modal>
        <h5>you want delete this Shipping ?</h5>
        <hr />
        <div className="d-flex align-items-center justify-content-around">
        {LoaderBtn ? <button className='btn btn-danger  w-50 mx-2 px-4' disabled><i className='fa fa-spin fa-spinner'></i></button>: 
        <button className='btn btn-danger  w-50 mx-2 px-4' onClick={()=>{deleteShipping(SelectedShippings)}}>Yes</button>}
        <button className='btn btn-primary w-50 mx-2  px-4' onClick={()=>{setDisplayDeleteDialog(false)}}>No</button>
        </div>
      </Dialog>  

      </div>
    }
    </>
}
