import axios from 'axios';
import { Button } from 'primereact/button';
import React, { useEffect, useState } from 'react';
import { ApiBaseUrl } from '../ApiBaseUrl';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Dialog } from 'primereact/dialog';
import { Calendar } from 'primereact/calendar';

export default function AddProduct({ LoaderBtn,headers, displayAddNewDialog,sec , secName , secId ,SecProductsRefetch, brandsNameResponse, categoriesNameResponse, SubcategoriesNameResponse,subSubcategoriesNameResponse, hideDialog, setLoaderBtn , AllRefetch }) {
const [AddNewError, setAddNewError] = useState(null);
const [selectedCategoryId, setSelectedCategoryId] = useState("");
const [selectedSubcategoryId, setSelectedSubcategoryId] = useState("");
const minDate = new Date();

  useEffect(()=>{
    if (sec === 'category') {
      setSelectedCategoryId(secId)
    }else if (sec==='subCategory') {
      setSelectedSubcategoryId(secId)
    }
  },[sec , secId]);

  const handleCategoryChange = (categoryId) => {
    if (sec === 'category') {
      setSelectedCategoryId(secId);
    }else{
      setSelectedCategoryId(categoryId);
    }
  };
  const handleSubcategoryChange = (subcategoryId) => {
    if (sec==='subCategory') {
      setSelectedSubcategoryId(secId);
    }
    setSelectedSubcategoryId(subcategoryId);
  };
  // *ANCHOR - get sub and sub-Sub depends on category => subCategory selection
  const filteredSubcategories = SubcategoriesNameResponse?.filter(subcategory => subcategory?.category._id === selectedCategoryId);
  const filteredSubSubcategories = subSubcategoriesNameResponse?.filter(subsubcategory => subsubcategory?.subCategory === selectedSubcategoryId);
  // *ANCHOR - get category for current subcategory depends on id from url
  const getCatForSub = SubcategoriesNameResponse
  ?.filter(subcategory => subcategory?._id === secId )
  .map(subcategory => subcategory?.category);
  // *ANCHOR - get category & subcategory for current subSubCategory depends on id from url
  const getParentsForSubSub = subSubcategoriesNameResponse?.filter(subSub=>subSub?._id === secId);

  const AddNewInitial = {
    name: '',
    price: '',
    description: '',
    number_quantity :'', 
    imageCover : '',
    images:'',
    sku : "",
    size:'',
    isUsed:'',
    color:"",
    brand: sec==='brand'? secId : '',
    subCategory: sec==='subCategory' ? secId : sec==='subSubCategory' ? getParentsForSubSub[0]?.subCategory :"",
    subSubCategory: sec==='subSubCategory'?secId : "",
    category: sec==='category' ? secId : 
      sec==='subCategory' ? getCatForSub[0]._id : 
      // *FIXME - make it category._id when backend add category name with it's id
      sec==='subSubCategory' ? getParentsForSubSub[0]?.category : "",
  ...((secName?.toLowerCase() === 'auction' || getCatForSub[0]?.name?.toLowerCase()=== 'auction' ) && {
      startDate: '',
      biddingPrice: '',
      startBidding: '',
      duration: '',
      biddingGap: '',
    }),
  };
  
  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    price: Yup.number().required('Price is required'),
    description: Yup.string().required('Description is required'),
    isUsed : Yup.string().required('Status is required'),
    brand: Yup.string().required('Brand is required'),
    category: Yup.string().required('category is required'),
    number_quantity :Yup.number().required('quantity Is Required'),
    size:Yup.string(),
    color:Yup.string(),
    subCategory:Yup.string(),
    subSubCategory:Yup.string(),
    sku: Yup.string()
    .matches(/^\d{8}$/, 'SKU must be exactly 8 digits')
    .required('SKU is Required'),
    imageCover: Yup.mixed().required('imageCover Is Required'),
    images: Yup.mixed().required('images Is Required'),
    ...((secName?.toLowerCase() === 'auction' || getCatForSub[0]?.name?.toLowerCase()=== 'auction')&& {
      startDate: Yup.date().required('Start date is required'),
      biddingPrice: Yup.number().required('Bidding price is required'),
      startBidding: Yup.number().required('Start bidding is required'),
      duration: Yup.number().required('Duration is required'),
      biddingGap: Yup.number().required('Bidding gap is required'),
    }),
  });

  const AddNewFormik = useFormik({
    initialValues: AddNewInitial,
    validationSchema,
    onSubmit: (values) => AddNewProducts(values),
  });

  const AddNewProducts =  (values) => {
    setLoaderBtn(true);
    setAddNewError(null)
    const formData = new FormData();
    formData.append('name', values.name);
    formData.append('price', values.price);
    formData.append('description', values.description);
    formData.append('brand', values.brand);
    formData.append('isUsed', values.isUsed);
    formData.append('category', values.category);
    values.subCategory !== '' &&  formData.append('subCategory', values.subCategory) 
    values.subSubCategory !== '' && formData.append('subSubCategory', values.subSubCategory) 
    formData.append('number_quantity', values.number_quantity);
    formData.append('size', values.size);
    formData.append('color', values.color);
    formData.append('sku', values.sku);
    formData.append('imageCover', values.imageCover);
    values.startDate !== '' &&  formData.append('startDate', values.startDate) ;
    values.biddingPrice !== '' &&  formData.append('biddingPrice', values.biddingPrice) ;
    values.startBidding !== '' &&  formData.append('startBidding', values.startBidding) ;
    values.duration !== '' &&  formData.append('duration', values.duration) ;
    values.biddingGap !== '' &&  formData.append('biddingGap', values.biddingGap) ;
    for (let i = 0; i < values.images.length; i++) {
      formData.append('images', values.images[i]);
    }
    axios.post(ApiBaseUrl + `products`, formData, { headers })
    .then( response =>{
      if (sec!=='all') {
        SecProductsRefetch();
      }else if (sec ==='all') {
        AllRefetch()
      }
      setLoaderBtn(false);
      hideDialog();
      AddNewFormik.resetForm();
    }).catch (error => {
      setAddNewError(error?.response?.data?.message);
      console.error(error);
      setLoaderBtn(false);
    })
  };

  return (
    <>
      <Dialog header={'Add New Product'} className='container editDialog' visible={displayAddNewDialog} onHide={hideDialog} modal>
        <form onSubmit={AddNewFormik.handleSubmit} className='bg-light p-3 border shadow-sm rounded'>

          <div className="form-floating mb-2">
            <input type="text" placeholder='Name' className="form-control" id="name" name="name" value={AddNewFormik.values.name} onChange={AddNewFormik.handleChange} onBlur={AddNewFormik.handleBlur} />
            <label className='ms-2' htmlFor="username">NAME</label>
            {AddNewFormik.errors.name && AddNewFormik.touched.name ? (<div className="alert text-danger">{AddNewFormik.errors.name}</div>) : null}
          </div>

          <div className="form-floating mb-2">
            <input type="number" placeholder='Quantity' className="form-control" id="number_quantity" name="number_quantity" value={AddNewFormik.values.number_quantity} onChange={AddNewFormik.handleChange} onBlur={AddNewFormik.handleBlur} />
            <label className='ms-2' htmlFor="number_quantity">Quantity</label>
            {AddNewFormik.errors.number_quantity && AddNewFormik.touched.number_quantity ? (<div className="alert text-danger">{AddNewFormik.errors.number_quantity}</div>) : null}
          </div>

          <div className="form-floating mb-2">
            <input type="text" placeholder='sku' className="form-control" id="sku" name="sku" maxLength={8} value={AddNewFormik.values.sku} onChange={AddNewFormik.handleChange} onBlur={AddNewFormik.handleBlur} />
            <label className='ms-2' htmlFor="sku">sku</label>
            {AddNewFormik.errors.sku && AddNewFormik.touched.sku ? (<div className="alert text-danger">{AddNewFormik.errors.sku}</div>) : null}
          </div>

          <div className="form-floating mb-2">
            <input type="number" placeholder='Price' className="form-control" id="price" name="price" value={AddNewFormik.values.price} onChange={AddNewFormik.handleChange} onBlur={AddNewFormik.handleBlur} />
            <label className='ms-2' htmlFor="price">PRICE</label>
            {AddNewFormik.errors.price && AddNewFormik.touched.price ? (<div className="alert text-danger">{AddNewFormik.errors.price}</div>) : null}
          </div>

          {(secName?.toLowerCase() === 'auction' || getCatForSub[0]?.name?.toLowerCase()=== 'auction') && (
            <>
              <div className="form-group my-2">
                <Calendar
                  className='w-100'
                  hideOnDateTimeSelect
                  inputId="startDate"
                  value={AddNewFormik.values.startDate}
                  onChange={(e) => AddNewFormik.setFieldValue("startDate", e.value)}
                  dateFormat="yy-mm-dd"
                  minDate={minDate}
                  showIcon
                  showTime hourFormat="12"
                  placeholder='Start Date'
                />
                {AddNewFormik.errors.startDate && AddNewFormik.touched.startDate ? (
                  <div className="alert text-danger">{AddNewFormik.errors.startDate}</div>
                ) : null}
              </div>

              <div className="form-floating mb-2">
                <input type="number" placeholder='Start Bidding' className="form-control" id="startBidding" name="startBidding" value={AddNewFormik.values.startBidding} onChange={AddNewFormik.handleChange} onBlur={AddNewFormik.handleBlur} />
                <label className='ms-2' htmlFor="startBidding">START BIDDING</label>
                {AddNewFormik.errors.startBidding && AddNewFormik.touched.startBidding ? (<div className="alert text-danger ">{AddNewFormik.errors.startBidding}</div>) : null}
              </div>

              <div className="form-floating mb-2">
                <input type="number" placeholder='biddingPrice' className="form-control" id="biddingPrice" name="biddingPrice" value={AddNewFormik.values.biddingPrice} onChange={AddNewFormik.handleChange} onBlur={AddNewFormik.handleBlur} />
                <label className='ms-2' htmlFor="biddingPrice">bidding Price</label>
                {AddNewFormik.errors.biddingPrice && AddNewFormik.touched.biddingPrice ? (<div className="alert text-danger ">{AddNewFormik.errors.biddingPrice}</div>) : null}
              </div>

              <div className="form-floating mb-2">
                <input type="number" placeholder='Bidding Gap' className="form-control" id="biddingGap" name="biddingGap" value={AddNewFormik.values.biddingGap} onChange={AddNewFormik.handleChange} onBlur={AddNewFormik.handleBlur} />
                <label className='ms-2' htmlFor="biddingGap">BIDDING GAP</label>
                {AddNewFormik.errors.biddingGap && AddNewFormik.touched.biddingGap ? (<div className="alert text-danger ">{AddNewFormik.errors.biddingGap}</div>) : null}
              </div>

              <div className="form-floating mb-2">
                <input type="number" placeholder='Duration' className="form-control" id="duration" name="duration" value={AddNewFormik.values.duration} onChange={AddNewFormik.handleChange} onBlur={AddNewFormik.handleBlur} />
                <label className='ms-2' htmlFor="duration">DURATION</label>
                {AddNewFormik.errors.duration && AddNewFormik.touched.duration ? (<div className="alert text-danger ">{AddNewFormik.errors.duration}</div>) : null}
              </div>
            </>
          )}

          <div className="form-floating mb-2">
            <textarea placeholder='Description' className="form-control" id="description" name="description" value={AddNewFormik.values.description} onChange={AddNewFormik.handleChange} onBlur={AddNewFormik.handleBlur} />
            <label className='ms-2' htmlFor="description">DESCRIPTION</label>
            {AddNewFormik.errors.description && AddNewFormik.touched.description ? (<div className="alert text-danger ">{AddNewFormik.errors.description}</div>) : null}
          </div>

          {(sec === 'all' || sec === 'brand') &&
            <div className="form-floating mb-2">
              <select className="form-select" id="category" name="category" value={AddNewFormik.values.category} onChange={(e) => { AddNewFormik.handleChange(e); handleCategoryChange(e.target.value); }} onBlur={AddNewFormik.handleBlur}>
                <option value="" disabled>Select Category</option>
                {categoriesNameResponse?.map(category => <option key={category._id} value={category._id}>{category.name}</option>)}
              </select>
              <label className='ms-2' htmlFor="category">category</label>
              {AddNewFormik.errors.category && AddNewFormik.touched.category ? (<div className="alert text-danger ">{AddNewFormik.errors.category}</div>) : null}
            </div>}

          {(sec !== 'subCategory' && sec !== 'subSubCategory') &&
            <div className="form-floating mb-2">
              <select className="form-select" id="subCategory" name="subCategory" value={AddNewFormik.values.subCategory} onChange={(e) => { AddNewFormik.handleChange(e); handleSubcategoryChange(e.target.value); }} onBlur={AddNewFormik.handleBlur}>
                <option value="" disabled>Select Subcategory</option>
                {filteredSubcategories?.map(subcategory => <option key={subcategory._id} value={subcategory._id}>{subcategory.name}</option>)}
              </select>
              <label className='ms-2' htmlFor="subCategory">Subcategory</label>
              {AddNewFormik.errors.subCategory && AddNewFormik.touched.subCategory ? (<div className="alert text-danger ">{AddNewFormik.errors.subCategory}</div>) : null}
            </div>}

          {(sec !== 'subSubCategory') &&
            <div className="form-floating mb-2">
              <select className="form-select" id="subSubCategory" name="subSubCategory" value={AddNewFormik.values.subSubCategory} onChange={(e)=>{ AddNewFormik.handleChange(e)}} onBlur={AddNewFormik.handleBlur}>
                <option value="" disabled>Select Sub-Subcategory</option>
                {filteredSubSubcategories.map(subsubcategory => <option key={subsubcategory._id} value={subsubcategory._id}>{subsubcategory.name}</option>)}
              </select>
              <label className='ms-2' htmlFor="subSubCategory">Sub-Subcategory</label>
              {AddNewFormik.errors.subSubCategory && AddNewFormik.touched.subSubCategory ? (<div className="alert text-danger ">{AddNewFormik.errors.subSubCategory}</div>) : null}
            </div>}

          {sec!=='brand' &&
          <div className="form-floating mb-2">
            <select className="form-select" id="brand" name="brand" value={AddNewFormik.values.brand} onChange={AddNewFormik.handleChange} onBlur={AddNewFormik.handleBlur}>
              <option value="" disabled>Select Brand</option>
              {brandsNameResponse?.map(brand => (
                <option key={brand._id} value={brand._id}>{brand.name}</option>
              ))}
            </select>            
            <label className='ms-2' htmlFor="brand">BRAND</label>
            {AddNewFormik.errors.brand && AddNewFormik.touched.brand ? (<div className="alert text-danger ">{AddNewFormik.errors.brand}</div>) : null}
          </div>}

          <div className="form-floating mb-2">
            <select
              className="form-select"
              id="size"
              name="size"
              value={AddNewFormik.values.size}
              onChange={AddNewFormik.handleChange}
              onBlur={AddNewFormik.handleBlur}
            >
              <option value="" disabled>Select Size</option>
              <option value="no size">no size</option>
              <option value="64GB">64GB</option>
              <option value="128GB">128GB</option>
              <option value="256GB">256GB</option>
              <option value="512GB">512GB</option>
              <option value="1TB">1TB</option>
            </select>
            <label className='ms-2' htmlFor="size">Size</label>
            {AddNewFormik.errors.size && AddNewFormik.touched.size ? (
              <div className="alert text-danger">{AddNewFormik.errors.size}</div>
            ) : null}
          </div>

          <div className="form-floating mb-2">
            <select
              className="form-select"
              id="Status"
              name="isUsed"
              value={AddNewFormik.values.isUsed}
              onChange={AddNewFormik.handleChange}
              onBlur={AddNewFormik.handleBlur}
            >
              <option value="" disabled>Select Status</option>
              <option value="false">New</option>
              <option value="true">Used</option>
            </select>
            <label className='ms-2' htmlFor="Status">Status</label>
            {AddNewFormik.errors.isUsed && AddNewFormik.touched.isUsed ? (
              <div className="alert text-danger">{AddNewFormik.errors.isUsed}</div>
            ) : null}
          </div>

          <div className="form-floating mb-2">
            <select
              className="form-select"
              id="color"
              name="color"
              value={AddNewFormik.values.color}
              onChange={AddNewFormik.handleChange}
              onBlur={AddNewFormik.handleBlur}
            >
              <option value="" disabled>Select color</option>
              <option value="Red">Red</option>
              <option value="Blue">Blue</option>
              <option value="Green">Green</option>
              <option value="White">White</option>
              <option value="Black">Black</option>
              <option value="Yellow">Yellow</option>
            </select>
            <label className='ms-2' htmlFor="color">color</label>
            {AddNewFormik.errors.color && AddNewFormik.touched.color ? (
              <div className="alert text-danger">{AddNewFormik.errors.color}</div>
            ) : null}
          </div>

          <div className="form-floating mb-2">
            <input type="file" className="form-control" id="imageCover" name="imageCover" onChange={(event) => {AddNewFormik.setFieldValue("imageCover", event.currentTarget.files[0])}} onBlur={AddNewFormik.handleBlur} />
            <label className='ms-2 mb-3 pt-2 h-auto p-0' htmlFor="imageCover">Image Cover</label>
            {AddNewFormik.errors.imageCover && AddNewFormik.touched.imageCover ? (<div className="alert text-danger">{AddNewFormik.errors.imageCover}</div>) : null}
          </div>

          <div className="form-floating mb-2">
            <input type="file" className="form-control" id="images" name="images" multiple onChange={(event) => {AddNewFormik.setFieldValue("images", event.currentTarget.files)}} onBlur={AddNewFormik.handleBlur} />
            <label className='ms-2 mb-3 pt-2 h-auto p-0' htmlFor="images">Images</label>
            {AddNewFormik.errors.images && AddNewFormik.touched.images ? (<div className="alert text-danger">{AddNewFormik.errors.images}</div>) : null}
          </div>

          {AddNewError ? <div className='alert text-danger'>{AddNewError}</div> :null}
          <div className="btns ms-auto w-100 d-flex justify-content-center mt-3">
            {LoaderBtn ? <button className='btn btn-primary text-light w-50' disabled><i className="fa fa-spin fa-spinner"></i></button> :
              <Button label="SUBMIT" type="submit" icon="pi pi-check" disabled={!(AddNewFormik.isValid && AddNewFormik.dirty)} className="btn btn-primary text-light w-50" />
            }
          </div>
        </form>
      </Dialog>
    </>
  );
}
