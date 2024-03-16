import axios from 'axios';
import { Button } from 'primereact/button';
import React, { useEffect, useState } from 'react';
import { ApiBaseUrl } from '../ApiBaseUrl';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Dialog } from 'primereact/dialog';
import { Calendar } from 'primereact/calendar';

export default function EditProduct({
    sec,
    secName,
    secId,
    AllRefetch,
    SecProductsRefetch,
    SelectedProducts,
    displayEditDialog ,
    setLoaderBtn,
    LoaderBtn,
    headers,
    brandsNameResponse,
    categoriesNameResponse,
    SubcategoriesNameResponse,
    subSubcategoriesNameResponse,
    hideDialog,
  }) {

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
  
    const [EditError, setEditError] = useState(null)
  // *NOTE - edit product formik
    let editInitial = {
      name: '',
      price: '',
      description: '',
      number_quantity :'', 
      imageCover : '',
      images:'',
      sku : "",
      size:'',
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
      }

      const validationSchema = Yup.object().shape({
        name: Yup.string().required('Name is required'),
        price: Yup.number().required('Price is required'),
        description: Yup.string().required('Description is required'),
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
    
    let editFormik = useFormik({
      initialValues : editInitial, 
      validationSchema ,
      onSubmit:(values)=>editCategory(SelectedProducts._id , values)
    })
  
    // *NOTE - set selected product values in edit form 
    useEffect(() => {
      if (SelectedProducts) {
        console.log(SelectedProducts);
        editFormik.setValues({
          name: SelectedProducts.name,
          price: SelectedProducts.price,
          description: SelectedProducts.description,
          brand: sec === 'brand' ? secId : SelectedProducts?.brand?._id,
          subCategory: sec === 'subCategory' ? secId : sec === 'subSubCategory' ? getParentsForSubSub[0]?.subCategory : SelectedProducts?.subCategory?._id,
          category: sec === 'category' ? secId :
            sec === 'subCategory' ? getCatForSub[0]._id :
            // *FIXME - make it category._id when backend add category name with it's id
            sec === 'subSubCategory' ? getParentsForSubSub[0]?.category : "",
          ...(secName?.toLowerCase() === 'auction' && {
            startDate: SelectedProducts.startDate.slice(0, 10),
            biddingPrice: SelectedProducts.biddingPrice,
            startBidding: SelectedProducts.startBidding,
            duration: SelectedProducts.duration,
            biddingGap: SelectedProducts.biddingGap,
          })
        })
      }
    }, [SelectedProducts]);
    
    // *NOTE - edit new product function
    const editCategory = (id, values) => {
      setLoaderBtn(true);
      setEditError(null)
      axios.patch(ApiBaseUrl + `products/${id}`, values, { headers })
        .then(response => {
          if (sec!=='all') {
            SecProductsRefetch();
          }else if (sec ==='all') {
            AllRefetch()
          }
          setLoaderBtn(false);
          hideDialog();
          editFormik.resetForm();
        })
        .catch(error => {
          setEditError(error.response.data.message);
          console.error(error);
          setLoaderBtn(false);
        });
    };
      
  return <>
      <Dialog header={'Edit Product'} className='container editDialog' visible={displayEditDialog} onHide={hideDialog} modal>
        <form onSubmit={editFormik.handleSubmit} className='bg-light p-3 border shadow-sm rounded'>

          <div className="form-floating mb-2">
            <input type="text" placeholder='Name' className="form-control" id="name" name="name" value={editFormik.values.name} onChange={editFormik.handleChange} onBlur={editFormik.handleBlur} />
            <label className='ms-2' htmlFor="username">NAME</label>
            {editFormik.errors.name && editFormik.touched.name ? (<div className="alert text-danger">{editFormik.errors.name}</div>) : null}
          </div>

          <div className="form-floating mb-2">
            <input type="number" placeholder='Quantity' className="form-control" id="number_quantity" name="number_quantity" value={editFormik.values.number_quantity} onChange={editFormik.handleChange} onBlur={editFormik.handleBlur} />
            <label className='ms-2' htmlFor="number_quantity">Quantity</label>
            {editFormik.errors.number_quantity && editFormik.touched.number_quantity ? (<div className="alert text-danger">{editFormik.errors.number_quantity}</div>) : null}
          </div>

          <div className="form-floating mb-2">
            <input type="text" placeholder='sku' className="form-control" id="sku" name="sku" maxLength={8} value={editFormik.values.sku} onChange={editFormik.handleChange} onBlur={editFormik.handleBlur} />
            <label className='ms-2' htmlFor="sku">sku</label>
            {editFormik.errors.sku && editFormik.touched.sku ? (<div className="alert text-danger">{editFormik.errors.sku}</div>) : null}
          </div>

          <div className="form-floating mb-2">
            <input type="number" placeholder='Price' className="form-control" id="price" name="price" value={editFormik.values.price} onChange={editFormik.handleChange} onBlur={editFormik.handleBlur} />
            <label className='ms-2' htmlFor="price">PRICE</label>
            {editFormik.errors.price && editFormik.touched.price ? (<div className="alert text-danger">{editFormik.errors.price}</div>) : null}
          </div>

          {(secName?.toLowerCase() === 'auction' || getCatForSub[0]?.name?.toLowerCase()=== 'auction' || SelectedProducts.isAction === true) && (
            <>
              <div className="form-group my-2">
                <Calendar
                  className='w-100'
                  hideOnDateTimeSelect
                  inputId="startDate"
                  value={editFormik.values.startDate}
                  onChange={(e) => editFormik.setFieldValue("startDate", e.value)}
                  dateFormat="yy-mm-dd"
                  minDate={minDate}
                  showIcon
                  showTime hourFormat="12"
                  placeholder='Start Date'
                />
                {editFormik.errors.startDate && editFormik.touched.startDate ? (
                  <div className="alert text-danger">{editFormik.errors.startDate}</div>
                ) : null}
              </div>

              <div className="form-floating mb-2">
                <input type="number" placeholder='Start Bidding' className="form-control" id="startBidding" name="startBidding" value={editFormik.values.startBidding} onChange={editFormik.handleChange} onBlur={editFormik.handleBlur} />
                <label className='ms-2' htmlFor="startBidding">START BIDDING</label>
                {editFormik.errors.startBidding && editFormik.touched.startBidding ? (<div className="alert text-danger ">{editFormik.errors.startBidding}</div>) : null}
              </div>

              <div className="form-floating mb-2">
                <input type="number" placeholder='biddingPrice' className="form-control" id="biddingPrice" name="biddingPrice" value={editFormik.values.biddingPrice} onChange={editFormik.handleChange} onBlur={editFormik.handleBlur} />
                <label className='ms-2' htmlFor="biddingPrice">bidding Price</label>
                {editFormik.errors.biddingPrice && editFormik.touched.biddingPrice ? (<div className="alert text-danger ">{editFormik.errors.biddingPrice}</div>) : null}
              </div>

              <div className="form-floating mb-2">
                <input type="number" placeholder='Bidding Gap' className="form-control" id="biddingGap" name="biddingGap" value={editFormik.values.biddingGap} onChange={editFormik.handleChange} onBlur={editFormik.handleBlur} />
                <label className='ms-2' htmlFor="biddingGap">BIDDING GAP</label>
                {editFormik.errors.biddingGap && editFormik.touched.biddingGap ? (<div className="alert text-danger ">{editFormik.errors.biddingGap}</div>) : null}
              </div>

              <div className="form-floating mb-2">
                <input type="number" placeholder='Duration' className="form-control" id="duration" name="duration" value={editFormik.values.duration} onChange={editFormik.handleChange} onBlur={editFormik.handleBlur} />
                <label className='ms-2' htmlFor="duration">DURATION</label>
                {editFormik.errors.duration && editFormik.touched.duration ? (<div className="alert text-danger ">{editFormik.errors.duration}</div>) : null}
              </div>
            </>
          )}

          <div className="form-floating mb-2">
            <textarea placeholder='Description' className="form-control" id="description" name="description" value={editFormik.values.description} onChange={editFormik.handleChange} onBlur={editFormik.handleBlur} />
            <label className='ms-2' htmlFor="description">DESCRIPTION</label>
            {editFormik.errors.description && editFormik.touched.description ? (<div className="alert text-danger ">{editFormik.errors.description}</div>) : null}
          </div>

          {(sec === 'all' || sec === 'brand') &&
            <div className="form-floating mb-2">
              <select className="form-select" id="category" name="category" value={editFormik.values.category} onChange={(e) => { editFormik.handleChange(e); handleCategoryChange(e.target.value); }} onBlur={editFormik.handleBlur}>
                <option value="" disabled>Select Category</option>
                {categoriesNameResponse?.map(category => <option key={category._id} value={category._id}>{category.name}</option>)}
              </select>
              <label className='ms-2' htmlFor="category">category</label>
              {editFormik.errors.category && editFormik.touched.category ? (<div className="alert text-danger ">{editFormik.errors.category}</div>) : null}
            </div>}

          {(sec !== 'subCategory' && sec !== 'subSubCategory') &&
            <div className="form-floating mb-2">
              <select className="form-select" id="subCategory" name="subCategory" value={editFormik.values.subCategory} onChange={(e) => { editFormik.handleChange(e); handleSubcategoryChange(e.target.value); }} onBlur={editFormik.handleBlur}>
                <option value="" disabled>Select Subcategory</option>
                {filteredSubcategories?.map(subcategory => <option key={subcategory._id} value={subcategory._id}>{subcategory.name}</option>)}
              </select>
              <label className='ms-2' htmlFor="subCategory">Subcategory</label>
              {editFormik.errors.subCategory && editFormik.touched.subCategory ? (<div className="alert text-danger ">{editFormik.errors.subCategory}</div>) : null}
            </div>}

          {(sec !== 'subSubCategory') &&
            <div className="form-floating mb-2">
              <select className="form-select" id="subSubCategory" name="subSubCategory" value={editFormik.values.subSubCategory} onChange={(e)=>{ editFormik.handleChange(e)}} onBlur={editFormik.handleBlur}>
                <option value="" disabled>Select Sub-Subcategory</option>
                {filteredSubSubcategories.map(subsubcategory => <option key={subsubcategory._id} value={subsubcategory._id}>{subsubcategory.name}</option>)}
              </select>
              <label className='ms-2' htmlFor="subSubCategory">Sub-Subcategory</label>
              {editFormik.errors.subSubCategory && editFormik.touched.subSubCategory ? (<div className="alert text-danger ">{editFormik.errors.subSubCategory}</div>) : null}
            </div>}

          {sec!=='brand' &&
          <div className="form-floating mb-2">
            <select className="form-select" id="brand" name="brand" value={editFormik.values.brand} onChange={editFormik.handleChange} onBlur={editFormik.handleBlur}>
              <option value="" disabled>Select Brand</option>
              {brandsNameResponse?.map(brand => (
                <option key={brand._id} value={brand._id}>{brand.name}</option>
              ))}
            </select>            
            <label className='ms-2' htmlFor="brand">BRAND</label>
            {editFormik.errors.brand && editFormik.touched.brand ? (<div className="alert text-danger ">{editFormik.errors.brand}</div>) : null}
          </div>}

          <div className="form-floating mb-2">
            <select
              className="form-select"
              id="size"
              name="size"
              value={editFormik.values.size}
              onChange={editFormik.handleChange}
              onBlur={editFormik.handleBlur}
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
            {editFormik.errors.size && editFormik.touched.size ? (
              <div className="alert text-danger">{editFormik.errors.size}</div>
            ) : null}
          </div>

          <div className="form-floating mb-2">
            <select
              className="form-select"
              id="Status"
              name="isUsed"
              value={editFormik.values.isUsed}
              onChange={editFormik.handleChange}
              onBlur={editFormik.handleBlur}
            >
              <option value="" disabled>Select Status</option>
              <option value="false">New</option>
              <option value="true">Used</option>
            </select>
            <label className='ms-2' htmlFor="Status">Status</label>
            {editFormik.errors.isUsed && editFormik.touched.isUsed ? (
              <div className="alert text-danger">{editFormik.errors.isUsed}</div>
            ) : null}
          </div>

          <div className="form-floating mb-2">
            <select
              className="form-select"
              id="color"
              name="color"
              value={editFormik.values.color}
              onChange={editFormik.handleChange}
              onBlur={editFormik.handleBlur}
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
            {editFormik.errors.color && editFormik.touched.color ? (
              <div className="alert text-danger">{editFormik.errors.color}</div>
            ) : null}
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
    </>
}
