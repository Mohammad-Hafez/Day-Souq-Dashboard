import React, { useEffect, useState  } from 'react'
import { Helmet } from 'react-helmet'
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import axios from 'axios';
import { ApiBaseUrl, ImgBaseURL } from '../ApiBaseUrl';
import { useQuery } from 'react-query';
import { useNavigate, useParams } from 'react-router-dom';

export default function SubCategory({headers}) {

  let navigate = useNavigate()
  let {CategoryName,id} = useParams()

  const [displayEditDialog, setDisplayEditDialog] = useState(false)
  const [displayDeleteDialog, setDisplayDeleteDialog] = useState(false)
  const [displayAddNewDialog, setDisplayAddNewDialog] = useState(false)
  const [SelectedSubCategory, setSelectedSubCategory] = useState(null)
  const [LoaderBtn, setLoaderBtn] = useState(false)
  const [SubCategory, setSubCategory] = useState()
  const getSubCategory = ()=> axios.get(ApiBaseUrl + `categories/${id}/subCategories`)
  let {data , refetch} = useQuery('sub category' , getSubCategory , {cacheTime : 50000})
  useEffect(()=>{
    if (data) {
      setSubCategory (data?.data.data.data);
    }
  },[data]);
  // *ANCHOR - Add new sub category 
  // *NOTE - add new sub category formik
  let AddNewInitial = {
    name :'', 
    image : ''

  }
  let AddNewFormik = useFormik({
    initialValues : AddNewInitial, 
    validationSchema : Yup.object().shape({
      name :Yup.string().required('Category Name Is Required') ,
      image : Yup.string().required('Category Image is Required')
    }),
    onSubmit:(values)=>AddNewSubCategory(values)
  })
  // *NOTE - add new sub category function
  const AddNewSubCategory = async (values) => {
    setLoaderBtn(true)
    const AddformData = new FormData();
    AddformData.append('name', values.name);
    AddformData.append('image', values.image); 
    AddformData.append('category', id); 
    try {
      await axios.post(ApiBaseUrl + `subCategories`, AddformData, { headers });
      refetch()
      setLoaderBtn(false)
      hideDialog()
    } catch (error) {
      console.error(error);
      setLoaderBtn(false)
    }
  };
  // *ANCHOR - edit selected sub category
  // *NOTE - edit new sub category formik
  let editInitial = {
    name :'', 
    image : ''

  }
  let editFormik = useFormik({
    initialValues : editInitial, 
    validationSchema : Yup.object().shape({
      name :Yup.string().required('Category Name Is Required') ,
      image : Yup.string().required('Category Image is Required')
    }),
    onSubmit:(values)=>editCategory(SelectedSubCategory._id , values)
  })
  // *NOTE - set selected sub category values in edit form 
  useEffect(()=>{
    if (SelectedSubCategory) {
      editFormik.setValues( {
        name: SelectedSubCategory.name,
        image: ''
      }  )
    }
  },[SelectedSubCategory]);
  // *NOTE - add new sub category function
  const editCategory = async (id, values) => {
    setLoaderBtn(true)
    const formData = new FormData();
    formData.append('name', values.name);
    formData.append('image', values.image); 
    try {
      await axios.patch(ApiBaseUrl + `subcategories/${id}`, formData, { headers });
      refetch()
      setLoaderBtn(false)
      hideDialog()
    } catch (error) {
      console.error(error);
      setLoaderBtn(false)
    }
  };
  // *ANCHOR - delete a sub category
  const deleteCategory =async (id)=>{
    try {
      await axios.delete(ApiBaseUrl + `SubCategory/${id}` , { headers })
      refetch()
      hideDialog()
    } catch (error) {
      console.error(error);
    }
  }
  // *ANCHOR - actions at table for each row
  const actionTemplate = (rowData) => {
    return (
      <div className='d-flex justify-content-center align-items-center '>
        <Button  icon="pi pi-pencil" className='TabelButton approve rounded-circle mx-1' onClick={() => {setDisplayEditDialog(true); setSelectedSubCategory(rowData)}} />
        <Button  icon="pi pi-trash" className='TabelButton Cancel rounded-circle mx-1' onClick={() => {setSelectedSubCategory(rowData._id) ; setDisplayDeleteDialog(true)}} />
      </div>
    );
  };
  // *ANCHOR - inage format 
  const catImage = (rowData) => {
    return rowData.image ? <img src={ImgBaseURL + rowData.image} alt={rowData.name + ' image'} className='w-25' /> : null;
  };
  
  const createdAtBody = (rowData) => {
    return rowData.createdAt ? rowData.createdAt.slice(0, 10) : null;
  };
  // *ANCHOR - hide all modals
  const hideDialog = () => {
    setDisplayEditDialog(false);
    setDisplayDeleteDialog(false)
    setDisplayAddNewDialog(false)
    editFormik.resetForm();
    AddNewFormik.resetForm();
  };

  const SubCategoryHeaderBody = ()=>{
    return(
      <div className='d-flex align-items-center justify-content-between'>
        <div className="headerLabel">
          <h3>SubCategory For {CategoryName}</h3>
        </div>
        <div className="addCategory">
          <button className='btn btn-secondary' onClick={()=>{setDisplayAddNewDialog(true)}}>Add New</button>
        </div>
      </div>
    )
  }
    
  const getProductsForSub = (rowData)=> <Button onClick={()=>navigate(`/Products/${CategoryName}/${id}/${rowData.name}/${rowData._id}`)} icon="pi pi-eye" className='TabelButton dark-blue-text blue-brdr bg-transparent rounded-circle mx-auto'/>
  
  return <>
    <Helmet>
      <title>Sub Category</title>
    </Helmet>
    <div className="container">
      <DataTable value={SubCategory} header={SubCategoryHeaderBody} paginator selectionMode="single" className={`dataTabel mb-4 text-capitalize AllList`} dataKey="_id" scrollable scrollHeight="100vh" tableStyle={{ minWidth: "50rem" }} rows={10} responsive="scroll">
        <Column field="image" header="Image" body={catImage} style={{ width: "10%", borderBottom: '1px solid #dee2e6' }} />
        <Column field="name" header="Name" sortable style={{ width: "10%", borderBottom: '1px solid #dee2e6' }} />
        <Column field="createdAt" header="Created At" body={createdAtBody} sortable style={{ width: "10%", borderBottom: '1px solid #dee2e6' }} />
        <Column header="Products" body={getProductsForSub}  style={{ width: "10%", borderBottom: '1px solid #dee2e6' }} />
        <Column header="edit" body={actionTemplate}  style={{ width: "10%", borderBottom: '1px solid #dee2e6' }} />
      </DataTable>
      <Dialog header={'Edit SubCategory'} className='container editDialog' visible={displayEditDialog} onHide={hideDialog} modal>
          <form onSubmit={editFormik.handleSubmit} className='bg-light p-3 border shadow-sm rounded'>
              <div className= "form-floating">
                {/*name input */}
                <input type="text" placeholder='Name' className="form-control mb-2" id="name" name="name"value={editFormik.values.name}onChange={editFormik.handleChange}onBlur={editFormik.handleBlur}/>
                <label className='ms-2' htmlFor="username">NAME</label>
                {editFormik.errors.name && editFormik.touched.name ? (<div className="alert alert-danger">{editFormik.errors.name}</div>) : null}
              </div>
              <div className="">
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
                  <div className="alert alert-danger py-1">{editFormik.errors.image}</div>
                ) : null}
              </div>
              <div className="btns ms-auto w-100 d-flex justify-content-center mt-3">
              {LoaderBtn ?   <button className='btn btn-primary text-light w-50' disabled><i className="fa fa-spin fa-spinner"></i></button>:
                <Button label="SUBMIT" type="submit" icon="pi pi-check" disabled={!(editFormik.isValid && editFormik.dirty)} className="btn btn-primary text-light w-50"/>
              }
              </div>
          </form>
      </Dialog>
      <Dialog header={'Delete SubCategory'} className='container editDialog' visible={displayDeleteDialog} onHide={hideDialog} modal>
        <h5>you want delete this subcategory ?</h5>
        <div className="d-flex align-items-center justify-content-around">
        <button className='btn btn-danger px-4' onClick={()=>{deleteCategory(SelectedSubCategory)}}>Yes</button>
        <button className='btn btn-primary  px-4' onClick={()=>{setDisplayDeleteDialog(false)}}>No</button>
        </div>
      </Dialog> 
      <Dialog header={'Add New SubCategory'} className='container editDialog' visible={displayAddNewDialog} onHide={hideDialog} modal>
        <form onSubmit={AddNewFormik.handleSubmit} className='bg-light p-3 border shadow-sm rounded'>
              <div className= "form-floating">
                {/*name input */}
                <input type="text" placeholder='Name' className="form-control mb-2" id="name" name="name"value={AddNewFormik.values.name}onChange={AddNewFormik.handleChange}onBlur={AddNewFormik.handleBlur}/>
                <label className='ms-2' htmlFor="username">NAME</label>
                {AddNewFormik.errors.name && AddNewFormik.touched.name ? (<div className="alert alert-danger">{AddNewFormik.errors.name}</div>) : null}
              </div>
              <div className="">
                {/* image input */}
                <input
                  type="file"
                  accept="image/*"
                  className='form-control w-100'
                  onChange={(e) => {
                    AddNewFormik.setFieldValue('image', e.target.files[0]);
                    AddNewFormik.handleChange(e);
                  }}
                />
                {AddNewFormik.errors.image && AddNewFormik.touched.image ? (
                  <div className="alert alert-danger py-1">{AddNewFormik.errors.image}</div>
                ) : null}
              </div>
              <div className="btns ms-auto w-100 d-flex justify-content-center mt-3">
              {LoaderBtn ? <button className='btn btn-primary text-light w-50' disabled><i className="fa fa-spin fa-spinner"></i></button>:
                <Button label="SUBMIT" type="submit" icon="pi pi-check" disabled={!(AddNewFormik.isValid && AddNewFormik.dirty)} className="btn btn-primary text-light w-50"/>
              }
              </div>
          </form>
      </Dialog>
      
    </div>
    </>
}
