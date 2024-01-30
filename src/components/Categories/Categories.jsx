import React, { useEffect, useState ,useContext } from 'react'
import { Helmet } from 'react-helmet'
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Icon } from 'react-icons-kit';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import axios from 'axios';
import { ApiBaseUrl, ImgBaseURL } from '../ApiBaseUrl';
import { useQuery } from 'react-query';
import { FileUpload } from 'primereact/fileupload';
import { FaRegEye } from "react-icons/fa6";
import { RiDeleteBinLine } from "react-icons/ri";

export default function Categories() {
  const user = localStorage.getItem("DaySooqDashUser") ;
  let headers = {
      'Authorization': `Bearer ${user}` 
  }

  const [displayEditDialog, setDisplayEditDialog] = useState(false)
  const [SelectedCategory, setSelectedCategory] = useState(null)
  const getCategories = ()=> axios.get(ApiBaseUrl + `categories`)
  let {data} = useQuery('All-Categories' , getCategories , {cacheTime : 50000})
  let Categories = data?.data.data.data;

  let editFormik = useFormik({
    initialValues : {
      name : '' , 
      image : ''
    }, 
    validationSchema : Yup.object().shape({
      name :Yup.string().required('Category Name Is Required') ,
      image : Yup.string().required('Category Image is Required')
    }),
    onSubmit:(values)=>editCategory(SelectedCategory._id , values)
  })
  const editCategory = async (id, values) => {
    const formData = new FormData();
    formData.append('name', values.name);
    formData.append('image', values.image); // Now, values.image is a File object
    let response = await axios.patch(ApiBaseUrl + `categories/${id}` , formData , {headers})
    console.log(response);
  };

  const actionTemplate = (rowData) => {
    return (
      <div className='d-flex justify-content-center align-items-center '>
        <Button  icon="pi pi-pencil" className='TabelButton approve rounded-circle mx-1' onClick={() => {setDisplayEditDialog(true); setSelectedCategory(rowData)}} />
        <Button  icon="pi pi-trash" className='TabelButton Cancel rounded-circle mx-1' onClick={() => {setDisplayEditDialog(true); setSelectedCategory(rowData)}} />
        
      </div>
    );
  };

  const catImage = (rowData) => {
    return (
      <img src={ImgBaseURL+ rowData.image} alt={rowData.name + 'image'} className='w-25' />
    )
  }

  const createdAtBody = (rowData)=> <div>{rowData.createdAt?.slice(0,10)}</div>

  const hideDialog = () => {
    setDisplayEditDialog(false);
    editFormik.resetForm();
  };

  return <>
    <Helmet>
      <title>Categories</title>
    </Helmet>
    <div className="container">
      <DataTable value={Categories} header={'all Categories'} paginator selectionMode="single" className={`dataTabel mb-4 text-capitalize AllList`} dataKey="_id" scrollable scrollHeight="100vh" tableStyle={{ minWidth: "50rem" }} rows={10} responsive="scroll">
        <Column field="image" header="Image" body={catImage} style={{ width: "10%", borderBottom: '1px solid #dee2e6' }} />
        <Column field="name" header="Name" sortable style={{ width: "10%", borderBottom: '1px solid #dee2e6' }} />
        <Column field="createdAt" header="Created At" body={createdAtBody} sortable style={{ width: "10%", borderBottom: '1px solid #dee2e6' }} />
         <Column header="Sub Categories" body={<Button icon="pi pi-eye" className='TabelButton dark-blue-text blue-brdr bg-transparent rounded-circle mx-auto'/>}  style={{ width: "10%", borderBottom: '1px solid #dee2e6' }} />
         <Column header="edit" body={actionTemplate}  style={{ width: "10%", borderBottom: '1px solid #dee2e6' }} />
      </DataTable>
      <Dialog header={'Edit Category'} className='container' visible={displayEditDialog} onHide={hideDialog} modal>
          <form onSubmit={editFormik.handleSubmit} className='bg-light p-3 border shadow-sm rounded'>
            <div className="row">
              <div className="col-sm-6 form-floating">
                {/*name input */}
                <input type="text" placeholder='Name' className="form-control mb-2" id="name" name="name"value={editFormik.values.name}onChange={editFormik.handleChange}onBlur={editFormik.handleBlur}/>
                <label className='ms-2' htmlFor="username">NAME</label>
                {editFormik.errors.name && editFormik.touched.name ? (<div className="alert alert-danger">{editFormik.errors.name}</div>) : null}
              </div>
              <div className="col-sm-6">
  {/* image input */}
  <input
    type="file"
    accept="image/*"
    className='form-control w-100'
    onChange={(e) => {
      editFormik.setFieldValue('image', e.target.files[0]);
      editFormik.handleChange(e);
    }}
  />
  {editFormik.errors.image && editFormik.touched.image ? (
    <div className="alert alert-danger">{editFormik.errors.image}</div>
  ) : null}
</div>

              <div className="btns ms-auto w-auto mt-3">
                <Button label="SUBMIT" type="submit" icon="pi pi-check" disabled={!(editFormik.isValid && editFormik.dirty)} className="btn btn-primary text-light "/>
              </div>
            </div> 
          </form>
      </Dialog>

    </div>
    </>
}
