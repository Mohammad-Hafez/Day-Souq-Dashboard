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
import { useParams } from 'react-router-dom';
import Loader from '../Loader/Loader';

export default function ProductVariants() {
  const user = localStorage.getItem("DaySooqDashUser") ;
  let headers = { 'Authorization': `Bearer ${user}` };

  let {productName , productId} = useParams()

  const [displayEditDialog, setDisplayEditDialog] = useState(false)
  const [displayDeleteDialog, setDisplayDeleteDialog] = useState(false)
  const [displayAddNewDialog, setDisplayAddNewDialog] = useState(false)
  const [SelectedProducts, setSelectedProducts] = useState(null)
  const [LoaderBtn, setLoaderBtn] = useState(false)
  const [Products, setProducts] = useState()
  const [AddError, setAddError] = useState(null)
  const [EditError, setEditError] = useState(null)

  const fetchProductVariants = ()=> axios.get(ApiBaseUrl + `products/${productId}/variants?dashboard=true`)

  let {data: ProductVariantsResponse , refetch: ProductVariantsRefetch , isLoading: ProductVariantsLoading} = useQuery('Product Variants' , fetchProductVariants , {cacheTime : 50000 })
  
  useEffect(()=>{
    if (ProductVariantsResponse ) {
      setProducts (ProductVariantsResponse?.data.data.data);
    }
  },[ProductVariantsResponse]);

  // *NOTE - edit product formik
  let initialVariant = {
    quantity :'', 
    imageCover : '',
    size:'',
    color:"",
    images:'',
    extraPrice : "" ,
    sku : "",
  }
  let validationSchema = Yup.object().shape({
    quantity :Yup.number().required('quantity Is Required') ,
    size :Yup.string(),
    color :Yup.string().required('color Is Required') ,
    extraPrice :Yup.number().required('extraPrice Is Required') ,
    sku: Yup.string()
    .matches(/^\d{8}$/, 'SKU must be exactly 8 digits')
    .required('SKU is Required'),
    imageCover: Yup.mixed().required('imageCover Is Required'),
    images: Yup.mixed().required('images Is Required')
  })

  let addFormik = useFormik({
    initialValues :initialVariant ,
    validationSchema , 
    onSubmit:(values)=> addVariant(values)
  })

  let editFormik = useFormik({
    initialValues : initialVariant, 
    validationSchema , 
    onSubmit:(values)=>editVariant(SelectedProducts._id , values)
  })

  // *ANCHOR - Add new variant
  const addVariant =  (values) => {
    setLoaderBtn(true)
    console.log("add=>" , values.images);
    console.log("cover=>" , values.imageCover);
    const formData = new FormData();
    formData.append('quantity', values.quantity);
    formData.append('size', values.size);
    formData.append('color', values.color);
    formData.append('sku', values.sku);
    formData.append('extraPrice', values.extraPrice);
    formData.append('imageCover', values.imageCover);
    for (let i = 0; i < values.images.length; i++) {
      formData.append('images', values.images[i]);
    }
    axios.post(ApiBaseUrl + `products/${productId}/variants`, formData, { headers })
      .then( response =>{
      ProductVariantsRefetch()
      setLoaderBtn(false)
      hideDialog()
      }).catch(error => {
        setAddError(error.response.data.message)
      console.error(error);
      setLoaderBtn(false)
    })
  };

  // *NOTE - set selected product values in edit form 
  useEffect(()=>{
    if (SelectedProducts) {
      editFormik.setValues( {
        quantity: SelectedProducts.quantity,
        imageCover: SelectedProducts.imageCover,
        size: SelectedProducts.size,
        color: SelectedProducts.color,
        images: SelectedProducts.images,
        sku: SelectedProducts.sku,
        extraPrice: SelectedProducts.extraPrice,
      }  )
    }
  },[SelectedProducts]);

  // *NOTE - edit new product function
  const editVariant =  (id, values) => {
    setLoaderBtn(true)
    const formData = new FormData();
    formData.append('product', productId);
    formData.append('quantity', values.quantity);
    formData.append('imageCover', values.imageCover);
    formData.append('size', values.size);
    formData.append('color', values.color);
    formData.append('extraPrice', values.extraPrice);
    for (let i = 0; i < values.images.length; i++) {
      formData.append('images', values.images[i]);
    }

    axios.patch(ApiBaseUrl + `variants/${id}`, formData, { headers })
    .then( response =>{
      ProductVariantsRefetch()
      setLoaderBtn(false)
      hideDialog()
    }).catch (error => {
      setEditError(error.response.data.message)
      console.error(error);
      setLoaderBtn(false)
    })
  };
  // *ANCHOR - delete product
  const deleteCategory = async (id)=>{
    try {
      await axios.delete(ApiBaseUrl + `variants/${id}` , { headers })
        ProductVariantsRefetch()
        hideDialog()
    } catch (error) {
      console.error(error);
    }
  }

    // *ANCHOR - hide all modals
  const hideDialog = () => {
    setDisplayEditDialog(false);
    setDisplayDeleteDialog(false);
    setDisplayAddNewDialog(false);
    setLoaderBtn(false)
  };

  // *ANCHOR - actions at table for each row
  const actionTemplate = (rowData) => {
    return (
      <div className='d-flex justify-content-center align-items-center '>
        <Button  icon="pi pi-pencil" className='TabelButton approve rounded-circle mx-1' onClick={() => {setDisplayEditDialog(true); setSelectedProducts(rowData)}} />
        <Button  icon="pi pi-trash" className='TabelButton Cancel rounded-circle mx-1' onClick={() => {setSelectedProducts(rowData._id) ; setDisplayDeleteDialog(true)}} />
      </div>
    );
  };
  // *ANCHOR - image format 
  const variantAllImages = (rowData) => rowData?.images?.map((image , index) => <img key={index} src={ImgBaseURL + image } alt={rowData.name + 'image'} className='w-25' />).slice(0,1)
  const variantImage = (rowData) => <img src={ImgBaseURL + rowData.imageCover } alt={rowData.name + 'image'} className='w-50' />
  
  const ProductsHeaderBody = ()=>{
    return(
      <div className='d-flex align-items-center justify-content-between'>
        <div className="headerLabel">
          {productName && <h3>Variants For {productName} </h3>}
        </div>
        <div className="addCategory">
          <button className='btn btn-secondary' onClick={()=>{setDisplayAddNewDialog(true)}}>Add New</button>
        </div>
      </div>
    )
  }
    
  return <>
    <Helmet>
      <title>Products</title>
    </Helmet>
    <div className="container-fluid">
      { ProductVariantsLoading? <div>
        <Loader/>
      </div> :<>
          <DataTable  value={Products}  header={ProductsHeaderBody} paginator selectionMode="single" className={`dataTabel mb-4 text-capitalize AllList`} dataKey="_id" scrollable scrollHeight="100vh" tableStyle={{ minWidth: "50rem" }} rows={10} responsive="scroll">
            <Column header="All Images" body={variantAllImages} style={{ width: "20%", borderBottom: '1px solid #dee2e6' }} />
            <Column header="Image" body={variantImage} style={{ width: "10%", borderBottom: '1px solid #dee2e6' }} />
            <Column field="quantity" header="quantity" sortable style={{ width: "10%", borderBottom: '1px solid #dee2e6' }} />
            <Column header="size" field='size' sortable style={{ width: "5%", borderBottom: '1px solid #dee2e6' }} />
            <Column field="extraPrice" header="extraPrice (JOD)" sortable style={{ width: "8%", borderBottom: '1px solid #dee2e6' }} />
            <Column header="color" field='color' sortable style={{ width: "5%", borderBottom: '1px solid #dee2e6' }} />
            <Column field="sku" header="sku" sortable style={{ width: "5%", borderBottom: '1px solid #dee2e6' }} />
            <Column header="edit" body={actionTemplate}  style={{ width: "10%", borderBottom: '1px solid #dee2e6' }} />
          </DataTable>
          <Dialog header={'Delete Variant'} className='container editDialog' visible={displayDeleteDialog} onHide={hideDialog} modal>
            <h5>you want delete this Variant ?</h5>
            <hr />
            <div className="d-flex align-items-center justify-content-around">
            <button className='btn btn-danger  w-50 mx-2 px-4' onClick={()=>{deleteCategory(SelectedProducts)}}>Yes</button>
            <button className='btn btn-primary w-50 mx-2 px-4' onClick={()=>{setDisplayDeleteDialog(false)}}>No</button>
            </div>
          </Dialog>   
          <Dialog header={'Edit Variant'} className='container editDialog' visible={displayEditDialog} onHide={hideDialog} modal>
            <form onSubmit={editFormik.handleSubmit} className='bg-light p-3 border shadow-sm rounded'>
              <div className="form-floating mb-2">
                <input type="number" placeholder='Quantity' className="form-control" id="quantity" name="quantity" value={editFormik.values.quantity} onChange={editFormik.handleChange} onBlur={editFormik.handleBlur} />
                <label className='ms-2' htmlFor="quantity">Quantity</label>
                {editFormik.errors.quantity && editFormik.touched.quantity ? (<div className="alert text-danger">{editFormik.errors.quantity}</div>) : null}
              </div>
              <div className="form-floating mb-2">
                <input type="text" placeholder='Size' className="form-control" id="size" name="size" value={editFormik.values.size} onChange={editFormik.handleChange} onBlur={editFormik.handleBlur} />
                <label className='ms-2' htmlFor="size">Size</label>
                {editFormik.errors.size && editFormik.touched.size ? (<div className="alert text-danger">{editFormik.errors.size}</div>) : null}
              </div>
              <div className="form-floating mb-2">
                <input type="text" placeholder='Color' className="form-control" id="color" name="color" value={editFormik.values.color} onChange={editFormik.handleChange} onBlur={editFormik.handleBlur} />
                <label className='ms-2' htmlFor="color">Color</label>
                {editFormik.errors.color && editFormik.touched.color ? (<div className="alert text-danger">{editFormik.errors.color}</div>) : null}
              </div>
              <div className="form-floating mb-2">
                <input type="number" placeholder='Extra Price' className="form-control" id="extraPrice" name="extraPrice" value={editFormik.values.extraPrice} onChange={editFormik.handleChange} onBlur={editFormik.handleBlur} />
                <label className='ms-2' htmlFor="extraPrice">Extra Price</label>
                {editFormik.errors.extraPrice && editFormik.touched.extraPrice ? (<div className="alert text-danger">{editFormik.errors.extraPrice}</div>) : null}
              </div>
              <div className="form-floating mb-2">
                <input type="file" className="form-control" id="imageCover" name="imageCover" onChange={(event) => {editFormik.setFieldValue("imageCover", event.currentTarget.files[0])}} onBlur={editFormik.handleBlur} />
                <label className='ms-2 mb-3 pt-2 h-auto p-0' htmlFor="imageCover">Image Cover</label>
                {editFormik.errors.imageCover && editFormik.touched.imageCover ? (<div className="alert text-danger">{editFormik.errors.imageCover}</div>) : null}
              </div>
              <div className="form-floating mb-2">
                <input type="file" className="form-control" id="images" name="images" multiple onChange={(event) => {editFormik.setFieldValue("images", event.currentTarget.files)}} onBlur={editFormik.handleBlur} />
                <label className='ms-2 mb-3 pt-2 h-auto p-0' htmlFor="images">Images</label>
                {editFormik.errors.images && editFormik.touched.images ? (<div className="alert text-danger">{editFormik.errors.images}</div>) : null}
              </div>
              {EditError ? <div className='alert text-danger'>{EditError}</div> :null}

              <div className="btns ms-auto w-100 d-flex justify-content-center mt-3">
            {LoaderBtn ? <button className='btn btn-primary text-light w-50' disabled><i className="fa fa-spin fa-spinner"></i></button> :
              <Button label="SUBMIT" type="submit" icon="pi pi-check" disabled={!(editFormik.isValid && editFormik.dirty)} className="btn btn-primary text-light w-50" />
            }
          </div>
            </form>
          </Dialog>
          <Dialog header={'Add New Variant'} className='container editDialog' visible={displayAddNewDialog} onHide={hideDialog} modal>
            <form onSubmit={addFormik.handleSubmit} className='bg-light p-3 border shadow-sm rounded'>
              <div className="form-floating mb-2">
                <input type="number" placeholder='Quantity' className="form-control" id="quantity" name="quantity" value={addFormik.values.quantity} onChange={addFormik.handleChange} onBlur={addFormik.handleBlur} />
                <label className='ms-2' htmlFor="quantity">Quantity</label>
                {addFormik.errors.quantity && addFormik.touched.quantity ? (<div className="alert text-danger">{addFormik.errors.quantity}</div>) : null}
              </div>
              <div className="form-floating mb-2">
                <input type="text" placeholder='sku' className="form-control" id="sku" name="sku" maxLength={8} value={addFormik.values.sku} onChange={addFormik.handleChange} onBlur={addFormik.handleBlur} />
                <label className='ms-2' htmlFor="sku">sku</label>
                {addFormik.errors.sku && addFormik.touched.sku ? (<div className="alert text-danger">{addFormik.errors.sku}</div>) : null}
              </div>
              <div className="form-floating mb-2">
                <select
                  className="form-control"
                  id="size"
                  name="size"
                  value={addFormik.values.size}
                  onChange={addFormik.handleChange}
                  onBlur={addFormik.handleBlur}
                >
                  <option value="" disabled>Select Size</option>
                  <option value="64GB">64GB</option>
                  <option value="128GB">128GB</option>
                  <option value="256GB">256GB</option>
                  <option value="512GB">512GB</option>
                  <option value="1TB">1TB</option>
                </select>
                <label className='ms-2' htmlFor="size">Size</label>
                {addFormik.errors.size && addFormik.touched.size ? (
                  <div className="alert text-danger">{addFormik.errors.size}</div>
                ) : null}
              </div>
              <div className="form-floating mb-2">
                <select
                  className="form-control"
                  id="color"
                  name="color"
                  value={addFormik.values.color}
                  onChange={addFormik.handleChange}
                  onBlur={addFormik.handleBlur}
                >
                  <option value="" disabled>Select Color</option>
                  <option value="Red">Red</option>
                  <option value="Blue">Blue</option>
                  <option value="Green">Green</option>
                  <option value="White">White</option>
                  <option value="Black">Black</option>
                  <option value="Yellow">Yellow</option>
                  {/* Add more colors as needed */}
                </select>
                <label className='ms-2' htmlFor="color">Color</label>
                {addFormik.errors.color && addFormik.touched.color ? (
                  <div className="alert text-danger">{addFormik.errors.color}</div>
                ) : null}
              </div>
              <div className="form-floating mb-2">
                <input type="number" placeholder='Extra Price' className="form-control" id="extraPrice" name="extraPrice" value={addFormik.values.extraPrice} onChange={addFormik.handleChange} onBlur={addFormik.handleBlur} />
                <label className='ms-2' htmlFor="extraPrice">Extra Price</label>
                {addFormik.errors.extraPrice && addFormik.touched.extraPrice ? (<div className="alert text-danger">{addFormik.errors.extraPrice}</div>) : null}
              </div>
              <div className="form-floating mb-2">
                <input type="file" className="form-control" id="imageCover" name="imageCover" onChange={(event) => {addFormik.setFieldValue("imageCover", event.currentTarget.files[0])}} onBlur={addFormik.handleBlur} />
                <label className='ms-2 mb-3 pt-2 h-auto p-0' htmlFor="imageCover">Image Cover</label>
                {addFormik.errors.imageCover && addFormik.touched.imageCover ? (<div className="alert text-danger">{addFormik.errors.imageCover}</div>) : null}
              </div>
              <div className="form-floating mb-2">
                <input type="file" className="form-control" id="images" name="images" multiple onChange={(event) => {addFormik.setFieldValue("images", event.currentTarget.files)}} onBlur={addFormik.handleBlur} />
                <label className='ms-2 mb-3 pt-2 h-auto p-0' htmlFor="images">Images</label>
                {addFormik.errors.images && addFormik.touched.images ? (<div className="alert text-danger">{addFormik.errors.images}</div>) : null}
              </div>
              {AddError ? <div className='alert text-danger'>{AddError}</div> :null}
              <div className="btns ms-auto w-100 d-flex justify-content-center mt-3">
            {LoaderBtn ? <button className='btn btn-primary text-light w-50' disabled><i className="fa fa-spin fa-spinner"></i></button> :
              <Button label="SUBMIT" type="submit" icon="pi pi-check" disabled={!(addFormik.isValid && addFormik.dirty)} className="btn btn-primary text-light w-50" />
            }
          </div>
            </form>
          </Dialog>
          </>  
      }
    </div>
    </>
}
