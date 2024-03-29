import React, { useState ,useEffect } from 'react';
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
  const [displayAddNewDialog, setDisplayAddNewDialog] = useState(false)

  const getAllCoupons = ()=> axios.get( ApiBaseUrl + `Coupons?dashboard=true`,{headers});
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

  let AddNewInitial = {
    type: '',
    value: '',
    expireDate: ''    
    }

    let AddNewFormik = useFormik({
      initialValues: AddNewInitial,
      validationSchema: Yup.object().shape({
        type: Yup.string().required('Discount Type is required'),
        value: Yup.number().required('Discount Value is required'),
        expireDate: Yup.date().required('Expiration Date is required')
      }),
      onSubmit: (values) => AddNewCoupon(values)
    });

    const AddNewCoupon = async (values) => {
      console.log(values);
      setLoaderBtn(true)
      await axios.post(ApiBaseUrl + `coupons`, 
      {discount :{
        type : values.type , 
        value : values.value , 
      },
      expireDate :values.expireDate
    }
      , { headers }).then(response =>
      {
      hideDialog()
      AllCouponsRefetch()
      setLoaderBtn(false)
      }).catch (error=> {
      setErrMsg(error.response.data.message)
      console.error(error);
      setLoaderBtn(false)
    })
  };

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
      setErrMsg(error.response.data.message)
      console.error(error);
      setLoaderBtn(false);
    }) 
  };

  const hideDialog = () => {
    setDisplayDeleteDialog(false);
    setSelectedCoupons(null);
    setDisplayAddNewDialog(false)
    AddNewFormik.resetForm();
    setLoaderBtn(false)
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
        <div className="d-flex flex-column">
        <div className="p-inputgroup w-auto mb-2">
          <span className="p-inputgroup-addon">
            <i className="pi pi-search" />
          </span>
          <input type="text" className="p-inputtext rounded-start-0" placeholder="Search by promoCode" value={searchValue} onChange={handleSearch} />
        </div>
        <div className="addCategory">
          <button className='btn btn-secondary w-100' onClick={() => { setDisplayAddNewDialog(true) }}>Add New</button>
        </div>

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
        <Dialog header={'Delete Coupon'} className='container editDialog' visible={displayDeleteDialog} onHide={hideDialog} modal>
        <h5>you want delete this Coupon ?</h5>
        <hr />
        <div className="d-flex align-items-center justify-content-around">
        {LoaderBtn ? <button className='btn btn-danger  w-50 mx-2 px-4' disabled><i className='fa fa-spin fa-spinner'></i></button>: 
        <button className='btn btn-danger  w-50 mx-2 px-4' onClick={()=>{deleteCoupon(SelectedCoupons)}}>Yes</button>}
        <button className='btn btn-primary w-50 mx-2  px-4' onClick={()=>{setDisplayDeleteDialog(false)}}>No</button>
        </div>
      </Dialog>  

      
      <Dialog header={'Add Coupon'} className='container editDialog' visible={displayAddNewDialog} onHide={hideDialog} modal>
  <form className='bg-light p-3 border shadow-sm rounded' onSubmit={AddNewFormik.handleSubmit}>
    <div className="form-floating mb-2">
      <select id="type" className="form-select"  name="type" value={AddNewFormik.values.type} onChange={AddNewFormik.handleChange} onBlur={AddNewFormik.handleBlur}>
        <option value="" disabled>Select Type</option>
        <option value="fixed">Fixed</option>
        <option value="percentage">Percentage</option>
      </select>
      <label htmlFor="type">Discount Type</label>
      {AddNewFormik.touched.type && AddNewFormik.errors.type && <small className="p-error">{AddNewFormik.errors.type}</small>}
    </div>

    <div className="form-floating mb-2">
      <input id="value" type="number" className="form-control"  name="value" value={AddNewFormik.values.value} onChange={AddNewFormik.handleChange} onBlur={AddNewFormik.handleBlur}/>
      <label htmlFor="value">Discount Value</label>
      {AddNewFormik.touched.value && AddNewFormik.errors.value && <small className="p-error">{AddNewFormik.errors.value}</small>}
    </div>

    <div className="form-floating mb-2">
      <input id="expireDate" type="date" className="form-control" name="expireDate" value={AddNewFormik.values.expireDate} onChange={AddNewFormik.handleChange} onBlur={AddNewFormik.handleBlur} />
      <label htmlFor="expireDate">Expiration Date</label>
      {AddNewFormik.touched.expireDate && AddNewFormik.errors.expireDate && <small className="p-error">{AddNewFormik.errors.expireDate}</small>}
    </div>

    {ErrMsg ? <div className='alert text-danger'>{ErrMsg}</div> :null}

    <div className="btns w-100 d-flex justify-content-center">
    {LoaderBtn ? <button className='btn btn-primary  w-50 mx-auto px-4' disabled><i className='fa fa-spin fa-spinner'></i></button>: 

      <Button
        label="SUBMIT"
        type="submit"
        icon="pi pi-check"
        disabled={!(AddNewFormik.isValid && AddNewFormik.dirty)}
        className="btn btn-primary text-light w-50 mx-auto "
      />
}
    </div>
  </form>
</Dialog>


      </div>
    }
    </>
}
