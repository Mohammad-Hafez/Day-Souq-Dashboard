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

export default function Categories() {
  const user = localStorage.getItem("DaySooqDashUser") ;
  let headers = {
      'Authorization': `Bearer ${user}` 
  }

  const [displayEditDialog, setDisplayEditDialog] = useState(false)
  const [displayDeleteDialog, setDisplayDeleteDialog] = useState(false)
  const [SelectedCategory, setSelectedCategory] = useState(null)
  const [EditLoad, setEditLoad] = useState(false)
  const [Categories, setCategories] = useState()
  const getCategories = ()=> axios.get(ApiBaseUrl + `categories`)
  let {data , refetch} = useQuery('All-Categories' , getCategories , {cacheTime : 50000})

  useEffect(()=>{
    if (data) {
      setCategories (data?.data.data.data)
    }
  },[data]);

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
    onSubmit:(values)=>editCategory(SelectedCategory._id , values)
  })

  useEffect(()=>{
    if (SelectedCategory) {
      editFormik.setValues( {
        name: SelectedCategory.name,
        image: ''
      }  )
    }
  },[SelectedCategory]);

  const editCategory = async (id, values) => {
    setEditLoad(true)
    const formData = new FormData();
    formData.append('name', values.name);
    formData.append('image', values.image); 
    try {
      let { data } = await axios.patch(ApiBaseUrl + `categories/${id}`, formData, { headers });
      setDisplayEditDialog(false);
      refetch()
      setEditLoad(false)
    } catch (error) {
      console.error(error);
      setEditLoad(false)
    }
  };
  
  const deleteCategory =async (id)=>{
    try {
      let {data} = await axios.delete(ApiBaseUrl + `categories/${id}` , { headers })
      refetch()
      setDisplayDeleteDialog(false)
    } catch (error) {
      console.error(error);
    }
  }
  
  const actionTemplate = (rowData) => {
    return (
      <div className='d-flex justify-content-center align-items-center '>
        <Button  icon="pi pi-pencil" className='TabelButton approve rounded-circle mx-1' onClick={() => {setDisplayEditDialog(true); setSelectedCategory(rowData)}} />
        <Button  icon="pi pi-trash" className='TabelButton Cancel rounded-circle mx-1' onClick={() => {setSelectedCategory(rowData._id) ; setDisplayDeleteDialog(true)}} />
      </div>
    );
  };

  const catImage = (rowData) => {
    return rowData.image ? <img src={ImgBaseURL + rowData.image} alt={rowData.name + 'image'} className='w-25' /> : null;
  };
  
  const createdAtBody = (rowData) => {
    return rowData.createdAt ? rowData.createdAt.slice(0, 10) : null;
  };

  const hideDialog = () => {
    setDisplayEditDialog(false);
    setDisplayDeleteDialog(false)
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
      <Dialog header={'Edit Category'} className='container editDialog' visible={displayEditDialog} onHide={hideDialog} modal>
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
              <div className="btns ms-auto w-auto mt-3">
              {EditLoad ?   <button className='btn btn-primary text-light '><i className="fa fa-spin fa-spinner"></i></button>:
                <Button label="SUBMIT" type="submit" icon="pi pi-check" disabled={!(editFormik.isValid && editFormik.dirty)} className="btn btn-primary text-light "/>
              }
              </div>
          </form>
      </Dialog>
      <Dialog header={'Delete Category'} className='container editDialog' visible={displayDeleteDialog} onHide={hideDialog} modal>
        <h5>Do You Sure you want delete this category ?</h5>
        <div className="d-flex align-items-center justify-content-around">
        <button className='btn btn-danger px-4' onClick={()=>{deleteCategory(SelectedCategory)}}>Yes</button>
        <button className='btn btn-primary  px-4' onClick={()=>{setDisplayDeleteDialog(false)}}>No</button>
        </div>
      </Dialog>       
    </div>
    </>
}
