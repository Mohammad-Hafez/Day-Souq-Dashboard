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
import { useNavigate, useParams } from 'react-router-dom';
import Loader from '../Loader/Loader';
import HideItemDialog from '../HideItemDialog/HideItemDialog';

export default function SubCategory() {
  const user = localStorage.getItem("DaySooqDashUser") ;
  let headers = {'Authorization': `Bearer ${user}`};

  let navigate = useNavigate();
  let { CategoryName, id , all} = useParams();

  const [displayEditDialog, setDisplayEditDialog] = useState(false);
  const [displayDeleteDialog, setDisplayDeleteDialog] = useState(false);
  const [displayAddNewDialog, setDisplayAddNewDialog] = useState(false);
  const [SelectedSubCategory, setSelectedSubCategory] = useState(null);
  const [LoaderBtn, setLoaderBtn] = useState(false);
  const [SubCategory, setSubCategory] = useState([]);
  const [filteredSubCategory, setFilteredSubCategory] = useState([]);
  const [ErrMsg, setErrMsg] = useState(null)
  const [HideDialogVisible, setHideDialogVisible] = useState(false)

  const getSubCategory = () => axios.get(ApiBaseUrl + `categories/${id}/subCategories?dashboard=true`);
  let { data:subForCategoryResponse, refetch: subForCategoryRefetch , isLoading: subForCategoryLoading} = useQuery('sub category', getSubCategory, { cacheTime: 50000 , enabled : !!CategoryName });

  const getAllSubCategories = ()=> axios.get(ApiBaseUrl + `subcategories?dashboard=true`)
  let {data:AllSubcategoriesResponse , isLoading :AllSubLoading , refetch:AllSubRefetch } = useQuery("all sbCategories" , getAllSubCategories , {cacheTime : 10000 , enabled : !!all})

  const getAllCatgories = ()=> axios.get(ApiBaseUrl+`categories?dashboard=true`)
  let {data:AllCategoriesPesponse} = useQuery('getCategories' , getAllCatgories , {cacheTime:10000 , enabled:!!all});

  useEffect(() => {
    if (subForCategoryResponse) {
      setSubCategory(subForCategoryResponse?.data.data.data);
      setFilteredSubCategory(subForCategoryResponse?.data.data.data);
    }else if (AllSubcategoriesResponse) {
      setSubCategory(AllSubcategoriesResponse?.data.data.data);
      setFilteredSubCategory(AllSubcategoriesResponse?.data.data.data);
    }
  }, [subForCategoryResponse , AllSubcategoriesResponse]);

  // Add new sub category
  let AddNewInitial = {
    name: '',
    image: '',
    category : ''
  };

  let AddNewFormik = useFormik({
    initialValues: AddNewInitial,
    validationSchema: Yup.object().shape({
      name: Yup.string().required('Category Name Is Required'),
      // image: Yup.string().required('Category Image is Required')
    }),
    onSubmit: (values) => AddNewSubCategory(values)
  });

  const AddNewSubCategory = (values) => {
    setLoaderBtn(true);
    setErrMsg(null);
    const AddformData = new FormData();
    AddformData.append('name', values.name);
    // AddformData.append('image', values.image);
    all ? AddformData.append('category', values.category) : AddformData.append('category', id);
    axios.post(ApiBaseUrl + `subCategories`, AddformData, {headers})
      .then(response=>{
      if (subForCategoryResponse) {
        subForCategoryRefetch();
      }else if (AllSubcategoriesResponse) {
        AllSubRefetch()
      }
      setLoaderBtn(false);
      hideDialog();
    }).catch (error=>{
      setErrMsg(error.response.data.message);
      console.error(error);
      setLoaderBtn(false);
    })
  };

  // Edit selected sub category
  let editInitial = {
    name: '',
    image: ''
  };

  let editFormik = useFormik({
    initialValues: editInitial,
    validationSchema: Yup.object().shape({
      name: Yup.string().required('Category Name Is Required'),
      // image: Yup.string().required('Category Image is Required')
    }),
    onSubmit: (values) => editSubCategory(SelectedSubCategory._id, values)
  });
  useEffect(() => {
    if (SelectedSubCategory) {
      editFormik.setValues({
        name: SelectedSubCategory.name,
        image: ''
      });
    }
  }, [SelectedSubCategory]);

  const editSubCategory =  (id, values) => {
    setLoaderBtn(true);
    setErrMsg(null);
    const formData = new FormData();
    formData.append('name', values.name);
    formData.append('image', values.image);
    axios.patch(ApiBaseUrl + `subcategories/${id}`, formData, { headers })
    .then(response=>{
      if (subForCategoryResponse) {
        subForCategoryRefetch();
      }else if (AllSubcategoriesResponse) {
        AllSubRefetch()
      }
      setLoaderBtn(false);
      hideDialog();
    }).catch (error=>{
      setErrMsg(error.response.data.message);
      console.error(error);
      setLoaderBtn(false);
    })
  };

    // *ANCHOR - hide subcategory from website
    const hide=(status, id)=>{
      setErrMsg(null);
      setLoaderBtn(true)
      axios.patch(ApiBaseUrl +`subcategories/${id}`,{isShown:!status},{headers : headers})
      .then(response=>{
        if (subForCategoryResponse) {
          subForCategoryRefetch();
        }else if (AllSubcategoriesResponse) {
          AllSubRefetch()
        }
        hideDialog()
        setLoaderBtn(false)
      }).catch (error =>{
        setErrMsg(error.response.data.message);
        console.error(error);
        setLoaderBtn(false)
      })
    }
  
  // Delete a sub category
  const deleteSubCategory = (id) => {
    setLoaderBtn(true)
    setErrMsg(null);
     axios.delete(ApiBaseUrl + `subcategories/${id}`, { headers })
     .then(response=>{
      if (subForCategoryResponse) {
        subForCategoryRefetch();
      }else if (AllSubcategoriesResponse) {
        AllSubRefetch()
      }
      setLoaderBtn(false)
      hideDialog();
    }).catch (error=> {
      setLoaderBtn(false)
      setErrMsg(error.response.data.message);
      console.error(error);
    })
  };

  // Actions at table for each row
  const actionTemplate = (rowData) => {
    return (
      <div className='d-flex justify-content-center align-items-center '>
        <Button icon="pi pi-pencil" className='TabelButton approve rounded-circle mx-1' onClick={() => { setDisplayEditDialog(true); setSelectedSubCategory(rowData) }} />
        {rowData.isShown === true ? 
          <Button onClick={() => {setSelectedSubCategory(rowData); setHideDialogVisible(true)}} icon="pi pi-lock-open" className='TabelButton rounded-circle mx-auto' outlined severity="secondary" />
        :
          <Button onClick={() => {setSelectedSubCategory(rowData); setHideDialogVisible(true)}} icon="pi pi-lock" className='TabelButton rounded-circle mx-auto' outlined severity="secondary" />
        }
        <Button icon="pi pi-trash" className='TabelButton Cancel rounded-circle mx-1' onClick={() => { setSelectedSubCategory(rowData._id); setDisplayDeleteDialog(true) }} />
      </div>
    );
  };

  // Image format 
  const catImage = (rowData) => {
    return rowData.image ? <img src={ImgBaseURL + rowData.image} alt={rowData.name + ' image'} className='w-25' /> : null;
  };

  const createdAtBody = (rowData) => {
    return rowData.createdAt ? rowData.createdAt.slice(0, 10) : null;
  };

  // Hide all modals
  const hideDialog = () => {
    setDisplayEditDialog(false);
    setDisplayDeleteDialog(false);
    setDisplayAddNewDialog(false);
    setHideDialogVisible(false);
    setErrMsg(null);
    setLoaderBtn(false)
    editFormik.resetForm();
    AddNewFormik.resetForm();
  }

  // Header body
  const SubCategoryHeaderBody = () => {
    return (
      <div className='d-flex align-items-center justify-content-between'>
        <div className="headerLabel">
          <h3>{all && 'All'} SubCategories  <span onClick={() => navigate(`/Categories`)} className='cursor-pointer'>{CategoryName && `For ${CategoryName}` }</span></h3>
        </div>
        <div className="d-flex flex-column">
        <div className="searchCategory mb-2">
          <input type="text" placeholder="Search by subcategory name" className='form-control' onChange={handleSearch} />
        </div>
        <div className="addCategory">
          {/* {all ? <span className='fs-6 fw-lighter'>For Adding New SubCategory Select Category First From All Categories Table</span> : */}
          <button className='btn btn-secondary w-100' onClick={() => { setDisplayAddNewDialog(true) }}>Add New</button>
          {/* } */}
        </div>
        </div>
      </div>
    );
  };

  // Handle search functionality
  const handleSearch = (e) => {
    const searchValue = e.target.value.toLowerCase();
    const filteredData = SubCategory.filter(category =>
      category.name.toLowerCase().includes(searchValue)
    );
    setFilteredSubCategory(filteredData);
  };
  const getSubForSubCategory = (rowData)=> <Button onClick={()=>navigate(`/SubSubCategory/${rowData.category.name}/${rowData.category._id}/${rowData._id}`)} icon="pi pi-eye" className='TabelButton dark-blue-text blue-brdr bg-transparent rounded-circle mx-auto'/>

  const ParentCategoryName = (rowData) => rowData?.category?.name 
  const getProductsForCategory = (rowData)=> <Button onClick={()=>navigate(`/Products/subCategory/${rowData.name}/${rowData._id}`)} icon="pi pi-eye" className='TabelButton dark-blue-text blue-brdr bg-transparent rounded-circle mx-auto'/>

  return (
    <>
      <Helmet>
        <title>Sub Category</title>
      </Helmet>
      {subForCategoryLoading ? <Loader/> : 
      <div className="container">
        <DataTable value={filteredSubCategory} header={SubCategoryHeaderBody} paginator selectionMode="single" className={`dataTabel mb-4 text-capitalize AllList`} dataKey="_id" scrollable scrollHeight="100vh" tableStyle={{ minWidth: "50rem" }} rows={10} responsive="scroll">
          <Column field="image" header="Image" body={catImage} style={{ width: "10%", borderBottom: '1px solid #dee2e6' }} />
          <Column field="name" header="Name" sortable style={{ width: "10%", borderBottom: '1px solid #dee2e6' }} />
          <Column field="_id" header="id" sortable style={{ width: "10%", borderBottom: '1px solid #dee2e6' }} />
          {all && <Column header="Category" body={ParentCategoryName} sortable style={{ width: "10%", borderBottom: '1px solid #dee2e6' }} /> }
          <Column header="Products" body={getProductsForCategory}  style={{ width: "10%", borderBottom: '1px solid #dee2e6' }} />
          <Column header="Sub-SubCategory" body={getSubForSubCategory}  style={{ width: "10%", borderBottom: '1px solid #dee2e6' }} />
          <Column field="createdAt" header="Created At" body={createdAtBody} sortable style={{ width: "10%", borderBottom: '1px solid #dee2e6' }} />
          <Column header="edit" body={actionTemplate} style={{ width: "10%", borderBottom: '1px solid #dee2e6' }} />
        </DataTable>
        <Dialog header={'Edit SubCategory'} className='container editDialog' visible={displayEditDialog} onHide={hideDialog} modal>
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
        <Dialog header={'Delete SubCategory'} className='container editDialog' visible={displayDeleteDialog} onHide={hideDialog} modal>
          <h5>Are you sure you want to delete this subcategory?</h5>
          <p>NOTE : By deleteing this subcategory you will delete all products in it</p>
          <hr />
          {ErrMsg ? <div className='alert text-danger'>{ErrMsg}</div> :null}
          <div className="d-flex align-items-center justify-content-around">
          {LoaderBtn ? <button className='btn w-50 mx-2 btn-danger px-4' disabled><i className="fa fa-spin fa-spinner"></i></button> :
            <button className='btn w-50 mx-2 btn-danger px-4' onClick={() => { deleteSubCategory(SelectedSubCategory) }}>Yes</button>
            } 
            <button className='btn w-50 mx-2 btn-primary  px-4' onClick={() => { setDisplayDeleteDialog(false) }}>No</button>
          </div>
        </Dialog>
        <Dialog header={'Add New SubCategory'} className='container editDialog' visible={displayAddNewDialog} onHide={hideDialog} modal>
          <form onSubmit={AddNewFormik.handleSubmit} className='bg-light p-3 border shadow-sm rounded'>
            <div className="form-floating mb-2">
              {/*name input */}
              <input type="text" placeholder='Name' className="form-control " id="name" name="name" value={AddNewFormik.values.name} onChange={AddNewFormik.handleChange} onBlur={AddNewFormik.handleBlur} />
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
            {all ? <>
              <div className="form-floating mb-2">
                  <select className="form-select" id="category" name="category" value={AddNewFormik.values.category} onChange={AddNewFormik.handleChange} onBlur={AddNewFormik.handleBlur}>
                  <option value="" disabled>Select Category</option>
                  {AllCategoriesPesponse?.data.data.data.map(subcategory => (
                    <option key={subcategory._id} value={subcategory._id}>{subcategory.name}</option>
                  ))}
                </select>            
              <label className='ms-2' htmlFor="subCategory">subCategory</label>
              {AddNewFormik.errors.subCategory && AddNewFormik.touched.subCategory ? (<div className="alert text-danger ">{AddNewFormik.errors.subCategory}</div>) : null}
              </div>
          </>
            :null}
            {ErrMsg ? <div className='alert text-danger'>{ErrMsg}</div> :null}
            <div className="btns ms-auto w-100 d-flex justify-content-center mt-3">
              {LoaderBtn ? <button className='btn btn-primary text-light w-50' disabled><i className="fa fa-spin fa-spinner"></i></button> :
                <Button label="SUBMIT" type="submit" icon="pi pi-check" disabled={!(AddNewFormik.isValid && AddNewFormik.dirty)} className="btn btn-primary text-light w-50" />
              }
            </div>
          </form>
        </Dialog>
        <HideItemDialog Dialog={Dialog} target={'SubCategory'} LoaderBtn={LoaderBtn} ErrMsg={ErrMsg} HideDialogVisible={HideDialogVisible} hideDialog={hideDialog} hide={hide} Selectedtarget={SelectedSubCategory} setHideDialogVisible={setHideDialogVisible}/>

      </div>
      }
    </>
  );
}

let ACCESSORIES_STORE_Sub =  [
  {"name": "Cables"},
  {"name": "Chargers & Plugs"},
  {"name": "Headphones & Sounds"},
  {"name": "Accessories"},
  {"name": "Strips & Hubs"},
  {"name": "Speakers"},
  {"name": "bands & fitness (smart watches)"},
  {"name": "Adapters & Connectors"},
  {"name": "iPad & Tablet Accessories"},
  {"name": "Backpacks & Luggage"}
]


    let HomeSub = 
      [
        {"name": "Smart Devices"},
        {"name": "Fitness"},
        {"name": "Kitchen Appliances"},
        {"name": "Cameras & Security"}
      ]
    
    let funSub =[
        {"name": "Massage & Relaxation"},
        {"name": "Notebooks & Agenda"},
        {"name": "Games & Toys"}
      ]
    
      let computerSub = [
        {"name": "Laptop"},
        {"name": "Computer"},
        {"name": "Screens & Monitors"},
        {"name": "Keyboards & Mouse"},
        {"name": "Computer Parts"},
        {"name": "Printers & Scanners"},
        {"name": "Storage & RAM's"},
        {"name": "Accessories"},
        {"name": "Backpacks & Luggage"}
      ];

