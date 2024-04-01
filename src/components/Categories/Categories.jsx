import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import axios from 'axios';
import { ApiBaseUrl, ImgBaseURL } from '../ApiBaseUrl';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';
import Loader from '../Loader/Loader';
import { BiSolidDiscount } from "react-icons/bi";
import DiscountDialog from '../DiscountDialog/DiscountDialog';
import HideItemDialog from '../HideItemDialog/HideItemDialog';

export default function Categories() {
  const user = localStorage.getItem("DaySooqDashUser") ;

  let headers = { 'Authorization': `Bearer ${user}` };

  let navigate = useNavigate();
  const [displayEditDialog, setDisplayEditDialog] = useState(false);
  const [displayDeleteDialog, setDisplayDeleteDialog] = useState(false);
  const [displayAddNewDialog, setDisplayAddNewDialog] = useState(false);
  const [SelectedCategory, setSelectedCategory] = useState(null);
  const [LoaderBtn, setLoaderBtn] = useState(false);
  const [Categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [DiscountDialogVisible, setDiscountDialogVisible] = useState(false)
  const [ErrMsg, setErrMsg] = useState(null)

  const getCategories = () => axios.get(ApiBaseUrl + `categories?dashboard=true`);

  let { data, refetch , isLoading} = useQuery('All-Categories', getCategories, { cacheTime: 50000 });

  useEffect(() => {
    if (data) {
      setCategories(data?.data.data.data);
      setFilteredCategories(data?.data.data.data);
    }
  }, [data]);

  let AddNewInitial = {
    name: '',
    image: ''
  };

  let AddNewFormik = useFormik({
    initialValues: AddNewInitial,
    validationSchema: Yup.object().shape({
      name: Yup.string().required('Category Name Is Required'),
      image: Yup.string().required('Category Image is Required')
    }),
    onSubmit: (values) => AddNewCategory(values)
  });

  const AddNewCategory = async (values) => {
    setLoaderBtn(true);
    const AddformData = new FormData();
    AddformData.append('name', values.name);
    AddformData.append('image', values.image);
    try {
      await axios.post(ApiBaseUrl + `categories`, AddformData, { headers });
      hideDialog();
      refetch();
      setLoaderBtn(false);
    } catch (error) {
      console.error(error);
      setLoaderBtn(false);
    }
  };

  let editInitial = {
    name: '',
    image: ''
  };

  let editFormik = useFormik({
    initialValues: editInitial,
    validationSchema: Yup.object().shape({
      name: Yup.string().required('Category Name Is Required'),
      image: Yup.string().required('Category Image is Required')
    }),
    onSubmit: (values) => editCategory(SelectedCategory._id, values)
  });

  useEffect(() => {
    if (SelectedCategory) {
      editFormik.setValues({
        name: SelectedCategory.name,
        image: ''
      });
    }
  }, [SelectedCategory]);
  
  const editCategory = async (id, values) => {
    setLoaderBtn(true);
    const editFormData = new FormData();
    editFormData.append('name', values.name);
    editFormData.append('image', values.image);
    try {
      await axios.patch(ApiBaseUrl + `categories/${id}`, editFormData, { headers });
      hideDialog();
      refetch();
      setLoaderBtn(false);
    } catch (error) {
      console.error(error);
      setLoaderBtn(false);
    }
  };

  let editDiscountFormik = useFormik({
    initialValues:{
      type :'',
      value :''
    },
    validationSchema : Yup.object().shape({
      type : Yup.string().required('Discount Type is required'),
      value : Yup.string().required('Discount value is required')
    }),
    onSubmit :(values) => editDiscount( SelectedCategory._id ,values)
  })

  const editDiscount = (id, values) => {
    setLoaderBtn(true)
    const { type, value } = values;
    const data = {
      discount: {
        type,
        value: parseFloat(value) 
      }
    };
    axios.patch(ApiBaseUrl + `products/discount/${id}/category`, data, { headers })
      .then(response => {
        refetch();
        hideDialog()
        setLoaderBtn(false)
      })
      .catch(error => {
        setErrMsg(error.response.data.message);
        console.error(error);
        setLoaderBtn(false)
      });
  };
  const [HideDialogVisible, setHideDialogVisible] = useState(false)
  const hide=(status, id)=>{
    setErrMsg(null);
    setLoaderBtn(true)
    axios.patch(ApiBaseUrl +`categories/${id}`,{isShown:!status},{headers : headers})
    .then(response=>{
      refetch()
      hideDialog()
      setLoaderBtn(false)
    }).catch (error =>{
      setErrMsg(error.response.data.message);
      console.error(error);
      setLoaderBtn(false)
    })
  }

  const deleteCategory = async (id) => {
    try {
      await axios.delete(ApiBaseUrl + `categories/${id}`, { headers });
      refetch();
      hideDialog();
    } catch (error) {
      console.error(error);
    }
  };

  const hideDialog = () => {
    setDisplayEditDialog(false);
    setDisplayDeleteDialog(false);
    setDisplayAddNewDialog(false);
    setDiscountDialogVisible(false);
    setHideDialogVisible(false);
    setSelectedCategory(null);
    setErrMsg(null);
    editFormik.resetForm();
    AddNewFormik.resetForm();
    editDiscountFormik.resetForm();
    setSelectedCategory(null);
  };

  const actionTemplate = (rowData) => {
    return (
      <div className='d-flex justify-content-center align-items-center '>
        <BiSolidDiscount  className='TabelButton discount rounded-circle mx-1 p-1' onClick={()=>{setDiscountDialogVisible(true); setSelectedCategory(rowData)}}/>
        <Button icon="pi pi-pencil" className='TabelButton approve rounded-circle mx-1' onClick={() => { setDisplayEditDialog(true); setSelectedCategory(rowData) }} />
        {rowData.isShown === true ? 
          <Button onClick={() => {setSelectedCategory(rowData); setHideDialogVisible(true)}} icon="pi pi-lock-open" className='TabelButton rounded-circle mx-auto' outlined severity="secondary" />
        :
          <Button onClick={() => {setSelectedCategory(rowData); setHideDialogVisible(true)}} icon="pi pi-lock" className='TabelButton rounded-circle mx-auto' outlined severity="secondary" />
        }
        <Button icon="pi pi-trash" className='TabelButton Cancel rounded-circle mx-1' onClick={() => { setSelectedCategory(rowData._id); setDisplayDeleteDialog(true) }} />
      </div>
    );
  };
  const catImage = (rowData) => {
    return rowData.image ? <img src={ImgBaseURL + rowData.image} alt={rowData.name + ' image'} className='w-25' /> : null;
  };
  const createdAtBody = (rowData) => {
    return rowData.createdAt ? rowData.createdAt.slice(0, 10) : null;
  };
  const categoriesHeaderBody = () => {
    return (
      <div className='d-flex align-items-center justify-content-between'>
        <div className="headerLabel">
          <h3>All Categories</h3>
        </div>
        <div className="d-flex flex-column">
          <div className="searchCategory">
            <input type="text" placeholder="Search by category name" className='form-control' onChange={handleSearch} />
          </div>
          <div className="addCategory">
            <button className='btn btn-secondary w-100 mt-2' onClick={() => { setDisplayAddNewDialog(true) }}>Add New</button>
          </div>
        </div>
      </div>
    );
  };

  const handleSearch = (e) => {
    const searchValue = e.target.value.toLowerCase();
    const filteredData = Categories.filter(category =>
      category.name.toLowerCase().includes(searchValue)
    );
    setFilteredCategories(filteredData);
  };
  const getSubCategory = (rowData) => <Button onClick={() => navigate(`/SubCategory/${rowData.name}/${rowData._id}`)} icon="pi pi-eye" className='TabelButton dark-blue-text blue-brdr bg-transparent rounded-circle mx-auto' />
  
  const discountBody = (rowData)=> rowData?.priceDiscount? rowData?.priceDiscount?.type === 'fixed' ? rowData?.priceDiscount?.value + ' JOD' : rowData?.priceDiscount?.value + ' %' : '0'
  const getProductsForCategory = (rowData)=> <Button onClick={()=>navigate(`/Products/category/${rowData.name}/${rowData._id}`)} icon="pi pi-eye" className='TabelButton dark-blue-text blue-brdr bg-transparent rounded-circle mx-auto'/>

  return <>
    <Helmet>
      <title>Categories</title>
    </Helmet>
    {isLoading ? <Loader/>
    :
    <div className="container">

      <DataTable value={filteredCategories} header={categoriesHeaderBody} paginator selectionMode="single" className={`dataTabel mb-4 text-capitalize AllList`} dataKey="_id" scrollable scrollHeight="100vh" tableStyle={{ minWidth: "50rem" }} rows={10} responsive="scroll">
        <Column field="image" header="Image" body={catImage} style={{ width: "10%", borderBottom: '1px solid #dee2e6' }} />
        <Column field="name" header="Name" sortable style={{ width: "10%", borderBottom: '1px solid #dee2e6' }} />
        <Column header="Discount" body={discountBody} sortable style={{ width: "5%", borderBottom: '1px solid #dee2e6' }} />
        <Column header="Products" body={getProductsForCategory}  style={{ width: "10%", borderBottom: '1px solid #dee2e6' }} />
        <Column field="createdAt" header="Created At" body={createdAtBody} sortable style={{ width: "10%", borderBottom: '1px solid #dee2e6' }} />
        <Column header="Sub Categories" body={getSubCategory} style={{ width: "10%", borderBottom: '1px solid #dee2e6' }} />
        <Column header="edit" body={actionTemplate} style={{ width: "10%", borderBottom: '1px solid #dee2e6' }} />
      </DataTable>

      <Dialog header={'Edit Category'} className='container editDialog' visible={displayEditDialog} onHide={hideDialog} modal>
        <form onSubmit={editFormik.handleSubmit} className='bg-light p-3 border shadow-sm rounded'>
          <div className="form-floating mb-2">
            {/*name input */}
            <input type="text" placeholder='Name' className="form-control" id="name" name="name" value={editFormik.values.name} onChange={editFormik.handleChange} onBlur={editFormik.handleBlur} />
            <label className='ms-2' htmlFor="username">NAME</label>
            {editFormik.errors.name && editFormik.touched.name ? (<div className="alert text-danger ">{editFormik.errors.name}</div>) : null}
          </div>
          <div className="mb-2">
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
              <div className="alert text-danger  py-1">{editFormik.errors.image}</div>
            ) : null}
          </div>
          {ErrMsg ? <div className='alert text-danger'>{ErrMsg}</div> :null}
          <div className="btns ms-auto w-100 d-flex justify-content-center mt-3">
            {LoaderBtn ? <button className='btn btn-primary text-light w-50' disabled><i className="fa fa-spin fa-spinner"></i></button> :
              <Button label="SUBMIT" type="submit" icon="pi pi-check" disabled={!(editFormik.isValid && editFormik.dirty)} className="btn btn-primary text-light w-50" />
            }
          </div>
        </form>
      </Dialog>

      <HideItemDialog Dialog={Dialog} target={'Category'} LoaderBtn={LoaderBtn} ErrMsg={ErrMsg} HideDialogVisible={HideDialogVisible} hideDialog={hideDialog} hide={hide} Selectedtarget={SelectedCategory} setHideDialogVisible={setHideDialogVisible}/>

      <DiscountDialog on={'category'} Dialog={Dialog} ErrMsg={ErrMsg} LoaderBtn={LoaderBtn} Button={Button} hideDialog={hideDialog}  editDiscountFormik={editDiscountFormik} DiscountDialogVisible={DiscountDialogVisible}/>
      
      <Dialog header={'Delete Category'} className='container editDialog' visible={displayDeleteDialog} onHide={hideDialog} modal>
        <h5>you want delete this category ?</h5>
        <hr />
        {ErrMsg ? <div className='alert text-danger'>{ErrMsg}</div> :null}
        <div className="d-flex align-items-center justify-content-around">
          <button className='btn w-50 mx-2 btn-danger px-4' onClick={() => { deleteCategory(SelectedCategory) }}>Yes</button>
          <button className='btn w-50 mx-2 btn-primary  px-4' onClick={() => { setDisplayDeleteDialog(false) }}>No</button>
        </div>
      </Dialog>

      <Dialog header={'Add New Category'} className='container editDialog' visible={displayAddNewDialog} onHide={hideDialog} modal>
        <form onSubmit={AddNewFormik.handleSubmit} className='bg-light p-3 border shadow-sm rounded'>
          <div className="form-floating mb-2">
            {/*name input */}
            <input type="text" placeholder='Name' className="form-control" id="name" name="name" value={AddNewFormik.values.name} onChange={AddNewFormik.handleChange} onBlur={AddNewFormik.handleBlur} />
            <label className='ms-2' htmlFor="username">NAME</label>
            {AddNewFormik.errors.name && AddNewFormik.touched.name ? (<div className="alert text-danger ">{AddNewFormik.errors.name}</div>) : null}
          </div>
          <div className="mb-2">
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
              <div className="alert text-danger  py-1">{AddNewFormik.errors.image}</div>
            ) : null}
          </div>
          {ErrMsg ? <div className='alert text-danger'>{ErrMsg}</div> :null}
          <div className="btns ms-auto w-100 d-flex justify-content-center mt-3">
            {LoaderBtn ? <button className='btn btn-primary text-light w-50' disabled><i className="fa fa-spin fa-spinner"></i></button> :
              <Button label="SUBMIT" type="submit" icon="pi pi-check" disabled={!(AddNewFormik.isValid && AddNewFormik.dirty)} className="btn btn-primary text-light w-50" />
            }
          </div>
        </form>
      </Dialog>

    </div>
    }
  </>;
}
