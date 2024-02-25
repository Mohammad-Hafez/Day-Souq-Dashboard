import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import axios from 'axios';
import { ApiBaseUrl } from '../ApiBaseUrl';
import { useQuery } from 'react-query';
import Loader from '../Loader/Loader';
import { useFormik } from 'formik';
import * as Yup from 'yup';

export default function Shipping() {
  const user = localStorage.getItem("DaySooqDashUser");
  let headers = { 'Authorization': `Bearer ${user}` };

  const [LoaderBtn, setLoaderBtn] = useState(false);
  const [SelectedShippings, setSelectedShippings] = useState(null);
  const [displayDeactiveDialog, setDisplayDeactiveDialog] = useState(false);
  const [displayActiveDialog, setDisplayActiveDialog] = useState(false);
  const [displayAddNewDialog, setDisplayAddNewDialog] = useState(false)
  const [ErrorMsg, setErrorMsg] = useState(null)

  const getAllShippings = () => axios.get(ApiBaseUrl + `Shippings`, { headers });
  let { data: AllShippingsResponse, isLoading: AllShippingsLoading, refetch: AllShippingsRefetch } = useQuery(
    'All-Shippings',
    getAllShippings,
    { cacheTime: 50000 }
  );

  let AddNewInitial = {
    name :'', 
    amount :'', 
    minimum :'', 
    maximum :'', 
    max_price : '',
    // active :false
  }

  let AddNewFormik = useFormik({
    initialValues : AddNewInitial, 
    validationSchema : Yup.object().shape({
      name :Yup.string().required('Blog name Is Required') ,
      amount :Yup.string().required('Blog amount Is Required') ,
      minimum :Yup.string().required('Blog minimum Is Required') ,
      maximum :Yup.string().required('Blog maximum Is Required') ,
      max_price : Yup.mixed().required('Blog max_price is Required')
    }),
    onSubmit:(values)=>AddNewShipping(values)
  })

  const AddNewShipping = async (values) => {
    setLoaderBtn(true)
      await axios.post(ApiBaseUrl + `shippings`, values, { headers }).then(response =>
      {
      hideDialog()
      AllShippingsRefetch()
      setLoaderBtn(false)
      }).catch (error=> {
      setErrorMsg(error.response.data.message)
      console.error(error);
      setLoaderBtn(false)
    })
  };


  const deleteShipping = async (id, status) => {
    setLoaderBtn(true);
    console.log(status);
      await axios.patch(ApiBaseUrl + `shippings/${id}`, { active: status }, { headers })
      .then(response => {
        hideDialog()
        AllShippingsRefetch()
        setLoaderBtn(false)
        }).catch (error=> {
        setErrorMsg(error.response.data.message)
        console.error(error);
        setLoaderBtn(false)
      })
  };

  const hideDialog = () => {
    setDisplayDeactiveDialog(false);
    setSelectedShippings(null);
    setDisplayActiveDialog(false);
    setDisplayAddNewDialog(false);
    setErrorMsg(null)
    AddNewFormik.resetForm()
  };

  const actionTemplate = (rowData) => {
    return (
      <div className='d-flex justify-content-center align-items-center'>
        {rowData.active ? (
          <Button icon="pi pi-lock" className='TabelButton Cancel rounded-circle mx-1' onClick={() => { setDisplayDeactiveDialog(true); setSelectedShippings(rowData) }} />
        ) : (
          <Button icon="pi pi-lock-open" className='TabelButton approve rounded-circle mx-1' onClick={() => { setDisplayActiveDialog(true); setSelectedShippings(rowData) }} />
        )}
      </div>
    );
  };

  const ShippingsHeader = () => {
    return (
      <div className='d-flex align-items-center justify-content-between'>
        <div className="headerLabel">
          <h3>
            All Shippings
          </h3>
        </div>
        <div className="add">
          <button className='btn btn-secondary w-100 px-4' onClick={()=>{setDisplayAddNewDialog(true)}}>Add New</button>
        </div>
      </div>
    );
  };

  const minDays = (rowData)=> <span>{rowData?.delivery_estimate.minimum}</span>
  const maxDays = (rowData)=> <span>{rowData?.delivery_estimate.maximum}</span>
  return (
    <>
      <Helmet>
        <title>All Shippings</title>
      </Helmet>
      {AllShippingsLoading ? <Loader /> :
        <div className="container">
          <DataTable
            value={AllShippingsResponse?.data.shippingRates}
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
            <Column header="amount (JOD)" field='amount' style={{ width: "10%", bShippingBottom: '1px solid #dee2e6' }} />
            <Column header="minimum Days" body={minDays}  style={{ width: "10%", bShippingBottom: '1px solid #dee2e6' }} />
            <Column header="maximum Days" body={maxDays}  style={{ width: "10%", bShippingBottom: '1px solid #dee2e6' }} />
            <Column header="max_price (JOD)" field='max_price' style={{ width: "10%", bShippingBottom: '1px solid #dee2e6' }} />
            <Column header="active" field='active' style={{ width: "10%", bShippingBottom: '1px solid #dee2e6' }} />
            <Column header="Active/Deactive" body={actionTemplate} style={{ width: "10%", bShippingBottom: '1px solid #dee2e6' }} />
          </DataTable>
          <Dialog header={'Deactive Shipping Term'} className='container editDialog' visible={displayDeactiveDialog} onHide={hideDialog} modal>
            <h5>Do you want to Deactivate this Shipping?</h5>
            <hr />
            {ErrorMsg ? <div className='alert text-danger'>{ErrorMsg}</div> :null}
            <div className="d-flex align-items-center justify-content-around">
              {LoaderBtn ? <button className='btn btn-danger  w-50 mx-2 px-4' disabled><i className='fa fa-spin fa-spinner'></i></button> :
                <button className='btn btn-danger  w-50 mx-2 px-4' onClick={() => { deleteShipping(SelectedShippings._id, false) }}>Yes</button>}
              <button className='btn btn-primary w-50 mx-2  px-4' onClick={() => { setDisplayDeactiveDialog(false) }}>No</button>
            </div>
          </Dialog>
          <Dialog header={'Acctive Shipping Term'} className='container editDialog' visible={displayActiveDialog} onHide={hideDialog} modal>
            <h5>Do you want to Activate this Shipping, It Must Be Only 1 Shipping Active?</h5>
            <hr />
            {ErrorMsg ? <div className='alert text-danger'>{ErrorMsg}</div> :null}

            <div className="d-flex align-items-center justify-content-around">
              {LoaderBtn ? <button className='btn btn-danger  w-50 mx-2 px-4' disabled><i className='fa fa-spin fa-spinner'></i></button> :
                <button className='btn btn-danger  w-50 mx-2 px-4' onClick={() => { deleteShipping(SelectedShippings._id, true) }}>Yes</button>}
              <button className='btn btn-primary w-50 mx-2  px-4' onClick={() => { setDisplayDeactiveDialog(false) }}>No</button>
            </div>
          </Dialog>

          <Dialog header={'Add New Banner'} className='container editDialog' visible={displayAddNewDialog} onHide={hideDialog} modal>
            <form onSubmit={AddNewFormik.handleSubmit} className='bg-light p-3 border shadow-sm rounded'>
              <div className= "form-floating mb-2">
                {/*title input */}
                <input type="text" placeholder='name' className="form-control " id="name" name="name"value={AddNewFormik.values.name}onChange={AddNewFormik.handleChange}onBlur={AddNewFormik.handleBlur}/>
                <label className='ms-2' htmlFor="username">name</label>
                {AddNewFormik.errors.name && AddNewFormik.touched.name ? (<div className="alert text-danger">{AddNewFormik.errors.name}</div>) : null}
              </div>
              <div className= "form-floating mb-2">
                {/*content input */}
                <input type="number" placeholder='amount' className="form-control " id="amount" name="amount"value={AddNewFormik.values.amount}onChange={AddNewFormik.handleChange}onBlur={AddNewFormik.handleBlur}/>
                <label className='ms-2' htmlFor="username">amount</label>
                {AddNewFormik.errors.amount && AddNewFormik.touched.amount ? (<div className="alert text-danger">{AddNewFormik.errors.amount}</div>) : null}
              </div>
              <div className= "form-floating mb-2">
                {/*minimum input */}
                <input type="number" placeholder='minimum' className="form-control " id="minimum" name="minimum"value={AddNewFormik.values.minimum}onChange={AddNewFormik.handleChange}onBlur={AddNewFormik.handleBlur}/>
                <label className='ms-2' htmlFor="username">minimum</label>
                {AddNewFormik.errors.minimum && AddNewFormik.touched.minimum ? (<div className="alert text-danger">{AddNewFormik.errors.minimum}</div>) : null}
              </div>
              <div className= "form-floating mb-2">
                {/*type input */}
                <input type="number" placeholder='maximum' className="form-control " id="maximum" name="maximum"value={AddNewFormik.values.maximum}onChange={AddNewFormik.handleChange}onBlur={AddNewFormik.handleBlur}/>
                <label className='ms-2' htmlFor="username">maximum</label>
                {AddNewFormik.errors.maximum && AddNewFormik.touched.maximum ? (<div className="alert text-danger">{AddNewFormik.errors.maximum}</div>) : null}
              </div>
              <div className= "form-floating mb-2">
                {/*type input */}
                <input type="number" placeholder='max_price' className="form-control " id="max_price" name="max_price"value={AddNewFormik.values.max_price}onChange={AddNewFormik.handleChange}onBlur={AddNewFormik.handleBlur}/>
                <label className='ms-2' htmlFor="username">max_price</label>
                {AddNewFormik.errors.max_price && AddNewFormik.touched.max_price ? (<div className="alert text-danger">{AddNewFormik.errors.max_price}</div>) : null}
              </div>
              {ErrorMsg ? <div className='alert text-danger'>{ErrorMsg}</div> :null}
              <div className="btns ms-auto w-100 d-flex justify-content-center mt-3">
              {LoaderBtn ? <button className='btn btn-primary text-light w-50' disabled><i className="fa fa-spin fa-spinner"></i></button>:
                <Button label="SUBMIT" type="submit" icon="pi pi-check" disabled={!(AddNewFormik.isValid && AddNewFormik.dirty)} className="btn btn-primary text-light w-50"/>
              }
              </div>
          </form>
      </Dialog>


        </div>
      }
    </>
  );
}
