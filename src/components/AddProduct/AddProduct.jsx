import React from 'react';

export default function AddProduct({ LoaderBtn, subCategoryId, categoryId , CategoryName, axios, headers, ApiBaseUrl, useFormik, Yup, Button, Dialog, displayAddNewDialog, bransResponse, hideDialog, setLoaderBtn, ProductsRefetch }) {
  const AddNewInitial = {
    name: '',
    price: '',
    description: '',
    brand: '',
    subCategory: subCategoryId,
    category: categoryId,
    ...(CategoryName?.toLowerCase() === 'auction' && {
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
    subCategory: Yup.string().required('Subcategory is required'),
    ...(CategoryName?.toLowerCase() === 'auction'&& {
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

  const AddNewProducts = async (values) => {
    setLoaderBtn(true);
    console.log(values.brand);
    try {
      await axios.post(ApiBaseUrl + `products`, values, { headers });
      ProductsRefetch();
      setLoaderBtn(false);
      hideDialog();
      AddNewFormik.resetForm();
    } catch (error) {
      console.error(error);
      setLoaderBtn(false);
    }
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
            <input type="number" placeholder='Price' className="form-control" id="price" name="price" value={AddNewFormik.values.price} onChange={AddNewFormik.handleChange} onBlur={AddNewFormik.handleBlur} />
            <label className='ms-2' htmlFor="price">PRICE</label>
            {AddNewFormik.errors.price && AddNewFormik.touched.price ? (<div className="alert text-danger">{AddNewFormik.errors.price}</div>) : null}
          </div>
          <div className="form-floating mb-2">
            <textarea placeholder='Description' className="form-control" id="description" name="description" value={AddNewFormik.values.description} onChange={AddNewFormik.handleChange} onBlur={AddNewFormik.handleBlur} />
            <label className='ms-2' htmlFor="description">DESCRIPTION</label>
            {AddNewFormik.errors.description && AddNewFormik.touched.description ? (<div className="alert text-danger ">{AddNewFormik.errors.description}</div>) : null}
          </div>
          <div className="form-floating mb-2">
            <select className="form-select" id="brand" name="brand" value={AddNewFormik.values.brand} onChange={AddNewFormik.handleChange} onBlur={AddNewFormik.handleBlur}>
              <option value="">Select Brand</option>
              {bransResponse?.map(brand => (
                <option key={brand._id} value={brand._id}>{brand.name}</option>
              ))}
            </select>            
            <label className='ms-2' htmlFor="brand">BRAND</label>
            {AddNewFormik.errors.brand && AddNewFormik.touched.brand ? (<div className="alert text-danger ">{AddNewFormik.errors.brand}</div>) : null}
          </div>
          {/* <div className="form-floating mb-2">
            <input type="text" placeholder='Subcategory' className="form-control" id="subCategory" name="subCategory" value={AddNewFormik.values.subCategory} onChange={AddNewFormik.handleChange} onBlur={AddNewFormik.handleBlur} />
            <label className='ms-2' htmlFor="subCategory">SUBCATEGORY</label>
            {AddNewFormik.errors.subCategory && AddNewFormik.touched.subCategory ? (<div className="alert text-danger ">{AddNewFormik.errors.subCategory}</div>) : null}
          </div> */}
          {CategoryName?.toLowerCase() === 'auction' && (
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