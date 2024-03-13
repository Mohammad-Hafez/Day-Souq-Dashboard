import axios from 'axios';
import { Button } from 'primereact/button';
import React, { useEffect, useState } from 'react';
import { ApiBaseUrl } from '../ApiBaseUrl';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Dialog } from 'primereact/dialog';

export default function AddProduct({ LoaderBtn,headers, displayAddNewDialog,sec , secName , secId ,SecProductsRefetch, brandsNameResponse, categoriesNameResponse, SubcategoriesNameResponse,subSubcategoriesNameResponse, hideDialog, setLoaderBtn , AllRefetch }) {

  useEffect(()=>{
    if (sec === 'category') {
      setSelectedCategoryId(secId)
    }else if (sec==='subCategory') {
      setSelectedSubcategoryId(secId)
    }
  },[sec , secId]);

  const [AddNewError, setAddNewError] = useState(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState("");

  const handleCategoryChange = (categoryId) => {
    setSelectedCategoryId(categoryId);
  };
  const handleSubcategoryChange = (subcategoryId) => {
    setSelectedSubcategoryId(subcategoryId);
  };

  const filteredSubcategories = SubcategoriesNameResponse.filter(subcategory => subcategory.category._id === selectedCategoryId);
  const filteredSubSubcategories = subSubcategoriesNameResponse.filter(subsubcategory => subsubcategory.subCategory === selectedSubcategoryId);

  const AddNewInitial = {
    name: '',
    price: '',
    description: '',
    quantity :'', 
    imageCover : '',
    images:'',
    sku : "",
    size:'',
    color:"",
    brand:  '',
    subCategory:  "",
    subSubcategory:  "",
    category:  "",
  ...(secName?.toLowerCase() === 'auction' && {
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
    brand: Yup.string().required('Brand is required'),
    category: Yup.string().required('category is required'),
    quantity :Yup.number().required('quantity Is Required') ,
    sku: Yup.string()
    .matches(/^\d{8}$/, 'SKU must be exactly 8 digits')
    .required('SKU is Required'),
    imageCover: Yup.mixed().required('imageCover Is Required'),
    images: Yup.mixed().required('images Is Required'),
    ...(secName?.toLowerCase() === 'auction'&& {
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
    const formData = new FormData();
    formData.append();
    for (let i = 0; i < values.images.length; i++) {
      formData.append('images', values.images[i]);
    }
    axios.post(ApiBaseUrl + `products`, values, { headers })
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
      setAddNewError(error.response.data.message);
      console.error(error);
      setLoaderBtn(false);
    })
  };
console.log(sec);
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
            <input type="number" placeholder='Price' className="form-control" id="price" name="price" value={AddNewFormik.values.price} onChange={AddNewFormik.handleChange} onBlur={AddNewFormik.handleBlur} />
            <label className='ms-2' htmlFor="price">PRICE</label>
            {AddNewFormik.errors.price && AddNewFormik.touched.price ? (<div className="alert text-danger">{AddNewFormik.errors.price}</div>) : null}
          </div>

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
              <select className="form-select" id="subSubcategory" name="subSubcategory" value={AddNewFormik.values.subSubcategory} onChange={(e)=>{ AddNewFormik.handleChange(e)}} onBlur={AddNewFormik.handleBlur}>
                <option value="" disabled>Select Sub-Subcategory</option>
                {filteredSubSubcategories.map(subsubcategory => <option key={subsubcategory._id} value={subsubcategory._id}>{subsubcategory.name}</option>)}
              </select>
              <label className='ms-2' htmlFor="subSubCategory">Sub-Subcategory</label>
              {AddNewFormik.errors.subSubcategory && AddNewFormik.touched.subSubcategory ? (<div className="alert text-danger ">{AddNewFormik.errors.subSubcategory}</div>) : null}
            </div>}

          {secName?.toLowerCase() === 'auction' && (
            <>
              <div className="form-floating mb-2">
                <input type="date" placeholder='Start Date' className="form-control" id="startDate" name="startDate" value={AddNewFormik.values.startDate} onChange={AddNewFormik.handleChange} onBlur={AddNewFormik.handleBlur} />
                <label className='ms-2' htmlFor="startDate">START DATE</label>
                {AddNewFormik.errors.startDate && AddNewFormik.touched.startDate ? (<div className="alert text-danger ">{AddNewFormik.errors.startDate}</div>) : null}
              </div>
              <div className="form-floating mb-2">
                <input type="number" placeholder='Bidding Price' className="form-control" id="biddingPrice" name="biddingPrice" value={AddNewFormik.values.biddingPrice} onChange={AddNewFormik.handleChange} onBlur={AddNewFormik.handleBlur} />
                <label className='ms-2' htmlFor="biddingPrice">BIDDING PRICE</label>
                {AddNewFormik.errors.biddingPrice && AddNewFormik.touched.biddingPrice ? (<div className="alert text-danger ">{AddNewFormik.errors.biddingPrice}</div>) : null}
              </div>
              <div className="form-floating mb-2">
                <input type="number" placeholder='Start Bidding' className="form-control" id="startBidding" name="startBidding" value={AddNewFormik.values.startBidding} onChange={AddNewFormik.handleChange} onBlur={AddNewFormik.handleBlur} />
                <label className='ms-2' htmlFor="startBidding">START BIDDING</label>
                {AddNewFormik.errors.startBidding && AddNewFormik.touched.startBidding ? (<div className="alert text-danger ">{AddNewFormik.errors.startBidding}</div>) : null}
              </div>
              <div className="form-floating mb-2">
                <input type="number" placeholder='Duration' className="form-control" id="duration" name="duration" value={AddNewFormik.values.duration} onChange={AddNewFormik.handleChange} onBlur={AddNewFormik.handleBlur} />
                <label className='ms-2' htmlFor="duration">DURATION</label>
                {AddNewFormik.errors.duration && AddNewFormik.touched.duration ? (<div className="alert text-danger ">{AddNewFormik.errors.duration}</div>) : null}
              </div>
              <div className="form-floating mb-2">
                <input type="number" placeholder='Bidding Gap' className="form-control" id="biddingGap" name="biddingGap" value={AddNewFormik.values.biddingGap} onChange={AddNewFormik.handleChange} onBlur={AddNewFormik.handleBlur} />
                <label className='ms-2' htmlFor="biddingGap">BIDDING GAP</label>
                {AddNewFormik.errors.biddingGap && AddNewFormik.touched.biddingGap ? (<div className="alert text-danger ">{AddNewFormik.errors.biddingGap}</div>) : null}
              </div>
            </>
          )}

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
            <input type="number" placeholder='Quantity' className="form-control" id="quantity" name="quantity" value={AddNewFormik.values.quantity} onChange={AddNewFormik.handleChange} onBlur={AddNewFormik.handleBlur} />
            <label className='ms-2' htmlFor="quantity">Quantity</label>
            {AddNewFormik.errors.quantity && AddNewFormik.touched.quantity ? (<div className="alert text-danger">{AddNewFormik.errors.quantity}</div>) : null}
          </div>

          <div className="form-floating mb-2">
            <input type="text" placeholder='sku' className="form-control" id="sku" name="sku" maxLength={8} value={AddNewFormik.values.sku} onChange={AddNewFormik.handleChange} onBlur={AddNewFormik.handleBlur} />
            <label className='ms-2' htmlFor="sku">sku</label>
            {AddNewFormik.errors.sku && AddNewFormik.touched.sku ? (<div className="alert text-danger">{AddNewFormik.errors.sku}</div>) : null}
          </div>

          <div className="form-floating mb-2">
            <select
              className="form-control"
              id="size"
              name="size"
              value={AddNewFormik.values.size}
              onChange={AddNewFormik.handleChange}
              onBlur={AddNewFormik.handleBlur}
            >
              <option value="" disabled>Select Size</option>
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
              className="form-control"
              id="color"
              name="color"
              value={AddNewFormik.values.color}
              onChange={AddNewFormik.handleChange}
              onBlur={AddNewFormik.handleBlur}
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
