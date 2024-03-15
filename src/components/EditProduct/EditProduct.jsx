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
        editFormik.setValues({
          name: SelectedProducts.name,
          price: SelectedProducts.price,
          description: SelectedProducts.description,
          brand: BrandName ? BrandId : SelectedProducts?.brand?._id ,
          subCategory: CategoryName? subCategoryId : SelectedProducts?.subCategory?._id,
          category: CategoryName ? categoryId : SelectedProducts?.subCategory?.category?._id,
          ...(CategoryName?.toLowerCase() === 'auction' && {
            startDate: SelectedProducts.startDate.slice(0,10),
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
      axios.patch(ApiBaseUrl + `products/${id}`, values, { headers })
        .then(response => {
          if (CategoryName) {
            SubcatProductsRefetch();
          } else if (BrandName) {
            BrandProductsRefetch();
          }else if (all) {
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
      <Dialog header={'Edit Product'} className='container editDialog px-0' visible={displayEditDialog} onHide={hideDialog} modal>
      <form onSubmit={editFormik.handleSubmit} className='bg-light p-3 border shadow-sm rounded'>
          <div className="form-floating mb-2">
            <input type="text" placeholder='Name' className="form-control" id="name" name="name" value={editFormik.values.name} onChange={editFormik.handleChange} onBlur={editFormik.handleBlur} />
            <label className='ms-2' htmlFor="username">NAME</label>
            {editFormik.errors.name && editFormik.touched.name ? (<div className="alert text-danger">{editFormik.errors.name}</div>) : null}
          </div>
          <div className="form-floating mb-2">
            <input type="number" placeholder='Price' className="form-control" id="price" name="price" value={editFormik.values.price} onChange={editFormik.handleChange} onBlur={editFormik.handleBlur} />
            <label className='ms-2' htmlFor="price">PRICE</label>
            {editFormik.errors.price && editFormik.touched.price ? (<div className="alert text-danger">{editFormik.errors.price}</div>) : null}
          </div>
          <div className="form-floating mb-2">
            <textarea placeholder='Description' className="form-control" id="description" name="description" value={editFormik.values.description} onChange={editFormik.handleChange} onBlur={editFormik.handleBlur} />
            <label className='ms-2' htmlFor="description">DESCRIPTION</label>
            {editFormik.errors.description && editFormik.touched.description ? (<div className="alert text-danger ">{editFormik.errors.description}</div>) : null}
          </div>
          {!CategoryName ? <>
            <div className="form-floating mb-2">
              <select className="form-select" id="brand" name="brand" value={editFormik.values.brand} onChange={editFormik.handleChange} onBlur={editFormik.handleBlur}>
                <option value="" disabled>Select Category</option>
                {categoriesNameResponse?.map(category => (
                  <option key={category._id} value={category._id}>{category.name}</option>
                ))}
              </select>            
            <label className='ms-2' htmlFor="category">category</label>
            {editFormik.errors.category && editFormik.touched.category ? (<div className="alert text-danger ">{editFormik.errors.category}</div>) : null}
          </div> 

          <div className="form-floating mb-2">
              <select className="form-select" id="brand" name="brand" value={editFormik.values.brand} onChange={editFormik.handleChange} onBlur={editFormik.handleBlur}>
                <option value="" disabled>Select Category</option>
                {SubcategoriesNameResponse?.map(subcategory => (
                  <option key={subcategory._id} value={subcategory._id}>{subcategory.name}</option>
                ))}
              </select>            
            <label className='ms-2' htmlFor="subCategory">subCategory</label>
            {editFormik.errors.subCategory && editFormik.touched.subCategory ? (<div className="alert text-danger ">{editFormik.errors.subCategory}</div>) : null}
          </div> 
          </> 
          : null}
          {CategoryName?.toLowerCase() === 'auction' && (
            <>
              <div className="form-floating mb-2">
                <input type="date" placeholder='Start Date' className="form-control" id="startDate" name="startDate" value={editFormik.values.startDate} onChange={editFormik.handleChange} onBlur={editFormik.handleBlur} />
                <label className='ms-2' htmlFor="startDate">START DATE</label>
                {editFormik.errors.startDate && editFormik.touched.startDate ? (<div className="alert text-danger ">{editFormik.errors.startDate}</div>) : null}
              </div>
              <div className="form-floating mb-2">
                <input type="number" placeholder='Bidding Price' className="form-control" id="biddingPrice" name="biddingPrice" value={editFormik.values.biddingPrice} onChange={editFormik.handleChange} onBlur={editFormik.handleBlur} />
                <label className='ms-2' htmlFor="biddingPrice">BIDDING PRICE</label>
                {editFormik.errors.biddingPrice && editFormik.touched.biddingPrice ? (<div className="alert text-danger ">{editFormik.errors.biddingPrice}</div>) : null}
              </div>
              <div className="form-floating mb-2">
                <input type="number" placeholder='Start Bidding' className="form-control" id="startBidding" name="startBidding" value={editFormik.values?.startBidding} onChange={editFormik.handleChange} onBlur={editFormik.handleBlur} />
                <label className='ms-2' htmlFor="startBidding">START BIDDING</label>
                {editFormik.errors.startBidding && editFormik.touched.startBidding ? (<div className="alert text-danger ">{editFormik.errors.startBidding}</div>) : null}
              </div>
              <div className="form-floating mb-2">
                <input type="number" placeholder='Duration' className="form-control" id="duration" name="duration" value={editFormik.values.duration} onChange={editFormik.handleChange} onBlur={editFormik.handleBlur} />
                <label className='ms-2' htmlFor="duration">DURATION</label>
                {editFormik.errors.duration && editFormik.touched.duration ? (<div className="alert text-danger ">{editFormik.errors.duration}</div>) : null}
              </div>
              <div className="form-floating mb-2">
                <input type="number" placeholder='Bidding Gap' className="form-control" id="biddingGap" name="biddingGap" value={editFormik.values.biddingGap} onChange={editFormik.handleChange} onBlur={editFormik.handleBlur} />
                <label className='ms-2' htmlFor="biddingGap">BIDDING GAP</label>
                {editFormik.errors.biddingGap && editFormik.touched.biddingGap ? (<div className="alert text-danger ">{editFormik.errors.biddingGap}</div>) : null}
              </div>
            </>
          )}
                    {!BrandName ? 
                    <div className="form-floating mb-2">
                    <select className="form-select" id="brand" name="brand" value={editFormik.values.brand} onChange={editFormik.handleChange} onBlur={editFormik.handleBlur}>
                      <option value="" disabled>Select Brand</option>
                      {brandsNameResponse?.map(brand => (
                        <option key={brand._id} value={brand._id}>{brand.name}</option>
                      ))}
                    </select>            
                    <label className='ms-2' htmlFor="brand">BRAND</label>
                    {editFormik.errors.brand && editFormik.touched.brand ? (<div className="alert text-danger ">{editFormik.errors.brand}</div>) : null}
                  </div>
        : null}

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
