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
import EditProduct from '../EditProduct/EditProduct';
import AddProduct from '../AddProduct/AddProduct';
import Loader from '../Loader/Loader';
import { BiSolidDiscount } from "react-icons/bi";
import DeleteDialog from '../DelDialog/DelDialog';
import DiscountDialog from '../DiscountDialog/DiscountDialog';
import DescriptionDialog from '../DescriptionDialog/DescriptionDialog';
import HideProductDialog from '../HideProductDialog/HideProductDialog';

export default function Products() {

  const user = localStorage.getItem("DaySooqDashUser") ;
  let headers = { 'Authorization': `Bearer ${user}` };

  let navigate = useNavigate();
  let {sec,secName,secId} = useParams();

  const [displayEditDialog, setDisplayEditDialog] = useState(false)
  const [displayDeleteDialog, setDisplayDeleteDialog] = useState(false)
  const [displayAddNewDialog, setDisplayAddNewDialog] = useState(false)
  const [SelectedProducts, setSelectedProducts] = useState(null)
  const [ProductDescription, setProductDescription] = useState('')
  const [ProductDescriptionVisible, setProductDescriptionVisible] = useState(false)
  const [DiscountDialogVisible, setDiscountDialogVisible] = useState(false)
  const [SelectedDiscount, setSelectedDiscount] = useState(null)
  const [HideDialogVisible, setHideDialogVisible] = useState(false)
  const [LoaderBtn, setLoaderBtn] = useState(false)
  const [Products, setProducts] = useState()
  const [filteredProducts, setFilteredProducts] = useState()
  const [AllDiscount, setAllDiscount] = useState(null)
  const [ErrMsg, setErrMsg] = useState(null)

  // *ANCHOR - get brands / cat. / sub-cat. / sub-subCat. for drop downs at edit & add forms
  const getAllBrands = () => axios.get(ApiBaseUrl + `brands`)
  const getAllCategories = () => axios.get(ApiBaseUrl + `categories`)
  const getAllSubcategories = ()=> axios.get(ApiBaseUrl +`subcategories`)
  const getAllSubSubCategories = ()=> axios.get(ApiBaseUrl +`subSubCategories`)
  let {data: brandsNameResponse} = useQuery(
    'get brands', getAllBrands, { cacheTime: 10000, enabled: sec !=='brand'});
  let {data: categoriesNameResponse} = useQuery(
    'get categories', getAllCategories, { cacheTime: 10000, enabled: sec !=='category'});
  let {data: SubcategoriesNameResponse} = useQuery(
    'get Subcategories', getAllSubcategories, { cacheTime: 10000, enabled: sec !=='subcategory'});
  let {data: subSubcategoriesNameResponse} = useQuery(
    'get sub-Subcategories', getAllSubSubCategories, { cacheTime: 10000, enabled: sec !=='subSubCategory'});
    
  // *ANCHOR - get products depends on user select 
  const getSecProducts = () => axios.get(ApiBaseUrl + `products?${sec}=${secId}&dashboard=true`);
  const getAllGeneralProducts = () => axios.get(ApiBaseUrl + `products?dashboard=true`);
  let { isLoading: AllLoading, data: AllResponse , refetch : AllRefetch } = useQuery(
    'get all products for general',
    getAllGeneralProducts,
    {cacheTime:50000, enabled: sec==='all'? true : false}
  );
  let { isLoading: ProductsLoading, data: SecProductsResponse, refetch: SecProductsRefetch } = useQuery(
    'sec-Products',
    getSecProducts,
    {cacheTime:50000, enabled: secName!=='all'? true : false}
  );

  // *ANCHOR - Show products depends on selected section from sidebar
  useEffect(() => {
    if (sec!=='all') {
      setProducts(SecProductsResponse?.data.data.data);
      setFilteredProducts(SecProductsResponse?.data.data.data);
    }else if (sec==='all') {
      setProducts(AllResponse?.data.data.data);
      setFilteredProducts(AllResponse?.data.data.data);
    }
  }, [sec, SecProductsResponse ,AllResponse]); 

  // *ANCHOR - delete product
  const deleteProduct = async (id) => {
    setErrMsg(null);
    setLoaderBtn(true)
      await axios.delete(ApiBaseUrl + `products/${id}`, { headers })
      .then(response =>{
      if (sec!=='all') {
        SecProductsRefetch()
      }else if (sec==='all') {
        AllRefetch()
      }
      hideDialog()
      setLoaderBtn(false)
    }).catch (error =>{
      setErrMsg(error.response.data.message);
      console.error(error);
      setLoaderBtn(false)
    })
  }

  // *ANCHOR - Edit product discount
  const editDiscount = (id, values) => {
    setLoaderBtn(true)
    const { type, value } = values;
    const data = {
      priceDiscount: {
        type,
        value: parseFloat(value)
      }
    };
    axios.patch(ApiBaseUrl + `products/${id}`, data, { headers })
      .then(response => {
        if (sec!=='all') {
          SecProductsRefetch()
        }else if (sec==='all') {
          AllRefetch()
        }
          hideDialog()
        setLoaderBtn(false)
      })
      .catch(error => {
        setErrMsg(error.response.data.message);
        console.error(error);
        setLoaderBtn(false)
      });
  };
  
  const editAllDiscount = (values ) => {
    setLoaderBtn(true)
    const { type, value ,enable } = values;
    const data = {
      discount: {
        type,
        value: parseFloat(value),
        enable 
      }
    };
    axios.patch(ApiBaseUrl + `products/discount`, data, { headers })
      .then(response => {
        if (sec!=='all') {
          SecProductsRefetch()
        }else if (sec==='all') {
          AllRefetch()
        }
          hideDialog()
        setLoaderBtn(false)
      })
      .catch(error => {
        setErrMsg(error.response.data.message);
        console.error(error);
        setLoaderBtn(false)
      });
  };

  let editDiscountFormik = useFormik({
    initialValues:{
      type: '',
      value: '',
      enable: AllDiscount ? '' : null 
    },
    validationSchema: Yup.object().shape({
      type: Yup.string().required('Discount Type is required'),
      value: Yup.string().required('Discount value is required')
    }),
    onSubmit: (values) => { 
      AllDiscount ?  editAllDiscount(values) : editDiscount(SelectedDiscount._id, values)
    }
  });
  
  // *ANCHOR - Hide Product from website
  const hideProduct=(status, id)=>{
    setErrMsg(null);
    setLoaderBtn(true)
    axios.patch(ApiBaseUrl +`products/${id}`,{isShown:!status},{headers : headers})
    .then(response=>{
      if (sec!=='all') {
        SecProductsRefetch()
      }else if (sec==='all') {
        AllRefetch()
      }
      hideDialog()
      setLoaderBtn(false)
    }).catch (error =>{
      setErrMsg(error.response.data.message);
      console.error(error);
      setLoaderBtn(false)
    })
  }

  // *ANCHOR - close all modals
  const hideDialog = () => {
    setDisplayEditDialog(false);
    setDisplayDeleteDialog(false);
    setDisplayAddNewDialog(false);
    setProductDescriptionVisible(false);
    setProductDescription('');
    setSelectedProducts(null);
    setDiscountDialogVisible(false);
    setSelectedDiscount(null);
    setHideDialogVisible(false)
    setLoaderBtn(false)
    editDiscountFormik.resetForm()
  };

  // *ANCHOR -  Handle search functionality
  const handleSearch = (e) => {
    const searchValue = e.target.value.toLowerCase();
    const filteredData = Products.filter(product =>
      product.name.toLowerCase().includes(searchValue)
    );
    setFilteredProducts(filteredData);
  };

  // *ANCHOR - actions at table and handle data response for each row
  const ProductsHeaderBody = () => {
    return (
      <div className='d-flex align-items-center justify-content-between'>
        <div className="headerLabel">
          {sec!=='all' && <h3>Products For <span className='cursor-pointer'>{secName}</span></h3>}
          {sec==='all' && <h3>All Products</h3>} 
        </div>
        <div className="d-flex flex-column">
        <div className="searchCategory mb-2">
          <input type="text" placeholder="Search by product name" className='form-control' onChange={handleSearch} />
        </div>
        <div className="addCategory w-100 d-flex">
          <button className='btn btn-secondary w-50 me-2' onClick={() => { setDisplayAddNewDialog(true) }}>Add New</button>
          <button className='btn btn-dark-blue approve w-50' onClick={() => { setDiscountDialogVisible(true) ; setAllDiscount('All') }}>All Discount</button>
        </div>
        </div>
      </div>
    )
  }
  const actionTemplate = (rowData) => {
    return (
      <div className='d-flex justify-content-center align-items-center '>
        
        <Button icon="pi pi-pencil" className='TabelButton approve rounded-circle mx-1' onClick={() => { setDisplayEditDialog(true); setSelectedProducts(rowData) }} />
        <BiSolidDiscount  className='TabelButton discount rounded-circle mx-1 p-1' onClick={()=>{setDiscountDialogVisible(true); setSelectedDiscount(rowData)}}/>
        {rowData.isShown === true ? 
          <Button onClick={() => {setSelectedProducts(rowData); setHideDialogVisible(true)}} icon="pi pi-lock-open" className='TabelButton rounded-circle mx-auto' outlined severity="secondary" />
        :
          <Button onClick={() => {setSelectedProducts(rowData); setHideDialogVisible(true)}} icon="pi pi-lock" className='TabelButton rounded-circle mx-auto' outlined severity="secondary" />
        }
        <Button icon="pi pi-trash" className='TabelButton Cancel rounded-circle mx-1' onClick={() => { setSelectedProducts(rowData._id); setDisplayDeleteDialog(true);}} />
      </div>
    );
  };  
  const productImage = (rowData) => rowData?.variants?.map((variant, index) => <img key={index} src={ImgBaseURL + variant.imageCover} alt={variant.name + 'image'} className='w-50' />)?.slice(0, 1)
  const getProductVariants = (rowData) => <Button onClick={() => navigate(`/ProductVariants/${rowData?.name}/${rowData._id}`)} icon="pi pi-eye" className='TabelButton dark-blue-text blue-brdr bg-transparent rounded-circle mx-auto' />
  const productStatus = (rowData) => rowData?.isUsed ? 'Used' : 'New'
  const sizesBody = (rowData) => rowData?.sizes?.map((size, index) => <span key={index} className='d-block'>{size}</span>)
  const descriptionBody = (rowData) => <Button onClick={() => { setProductDescription(rowData.description); setProductDescriptionVisible(true) }} icon="pi pi-eye" className='TabelButton dark-blue-text blue-brdr bg-transparent rounded-circle mx-auto' />
  const discountBody = (rowData)=> rowData?.priceDiscount?.type === 'fixed' ? rowData?.priceDiscount?.value + ' JOD' : rowData?.priceDiscount.value + ' %'
  
return <>
    <Helmet>
      <title>Products</title>
    </Helmet>
    <div className="container-fluid">
      {ProductsLoading || AllLoading? <Loader /> : <>
          <DataTable value={filteredProducts} header={ProductsHeaderBody} paginator selectionMode="single" className={`dataTabel mb-4 text-capitalize AllList`} dataKey="_id" scrollable scrollHeight="100vh" tableStyle={{ minWidth: "50rem" }} rows={10} responsive="scroll">
            <Column header="Images" body={productImage} style={{ width: "8%", borderBottom: '1px solid #dee2e6' }} />
            <Column field="name" header="Name" sortable style={{ width: "20%", borderBottom: '1px solid #dee2e6' }} />
            <Column header="description" body={descriptionBody} sortable style={{ width: "5%", borderBottom: '1px solid #dee2e6' }} />
            <Column field="price" header="Price (JOD)" sortable style={{ width: "8%", borderBottom: '1px solid #dee2e6' }} />
            <Column header="sizes" body={sizesBody} sortable style={{ width: "8%", borderBottom: '1px solid #dee2e6' }} />
            <Column header="Discount" body={discountBody} sortable style={{ width: "5%", borderBottom: '1px solid #dee2e6' }} />
            <Column field="quantity" header="quantity" sortable style={{ width: "5%", borderBottom: '1px solid #dee2e6' }} />
            <Column header="status" body={productStatus} sortable style={{ width: "5%", borderBottom: '1px solid #dee2e6' }} />
            <Column header="Variants" body={getProductVariants} style={{ width: "5%", borderBottom: '1px solid #dee2e6' }} />
            <Column header="Actions" body={actionTemplate} style={{ width: "10%", borderBottom: '1px solid #dee2e6' }} />
          </DataTable>

          <DeleteDialog Dialog={Dialog} LoaderBtn={LoaderBtn} ErrMsg={ErrMsg} displayDeleteDialog={displayDeleteDialog} hideDialog={hideDialog} deleteProduct={deleteProduct} SelectedProducts={SelectedProducts} setDisplayDeleteDialog={setDisplayDeleteDialog} />
          
          <DiscountDialog Dialog={Dialog} AllDiscount={AllDiscount} on={SelectedDiscount?.name} ErrMsg={ErrMsg} LoaderBtn={LoaderBtn} Button={Button} hideDialog={hideDialog}  editDiscountFormik={editDiscountFormik} DiscountDialogVisible={DiscountDialogVisible}/>
      
          <DescriptionDialog Dialog={Dialog} ProductDescriptionVisible={ProductDescriptionVisible} hideDialog={hideDialog} ProductDescription={ProductDescription}/>

          <HideProductDialog Dialog={Dialog} LoaderBtn={LoaderBtn} ErrMsg={ErrMsg} HideDialogVisible={HideDialogVisible} hideDialog={hideDialog} hideProduct={hideProduct} SelectedProducts={SelectedProducts} setHideDialogVisible={setHideDialogVisible}/>
          
          {displayEditDialog &&
            <EditProduct
              SelectedProducts={SelectedProducts}
              displayEditDialog={displayEditDialog}
              headers={headers}
              sec={sec}
              secName={secName}
              secId={secId}
              hideDialog={hideDialog}
              LoaderBtn={LoaderBtn}
              setLoaderBtn={setLoaderBtn}
              SecProductsRefetch={SecProductsRefetch}
              AllRefetch={AllRefetch}
              brandsNameResponse={brandsNameResponse?.data.data.data}
              categoriesNameResponse={categoriesNameResponse?.data.data.data}
              SubcategoriesNameResponse={SubcategoriesNameResponse?.data.data.data}
              subSubcategoriesNameResponse={subSubcategoriesNameResponse?.data.data.data}
            />
          }

          {displayAddNewDialog &&
            <AddProduct
              headers={headers}
              sec={sec}
              secName={secName}
              secId={secId}
              displayAddNewDialog={displayAddNewDialog}
              hideDialog={hideDialog}
              LoaderBtn={LoaderBtn}
              setLoaderBtn={setLoaderBtn}
              SecProductsRefetch={SecProductsRefetch}
              AllRefetch={AllRefetch}
              brandsNameResponse={brandsNameResponse?.data.data.data}
              categoriesNameResponse={categoriesNameResponse?.data.data.data}
              SubcategoriesNameResponse={SubcategoriesNameResponse?.data.data.data}
              subSubcategoriesNameResponse={subSubcategoriesNameResponse?.data.data.data}
            />
          }
        </>
      }
    </div>
  </>
}
