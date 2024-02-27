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

  let { CategoryName, SubCategoryName, categoryId, subCategoryId, BrandId, BrandName , all } = useParams();

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
  const [ErrMsg, setErrMsg] = useState(null)


  const getAllBrands = () => axios.get(ApiBaseUrl + `brands`)
  const getAllCategories = () => axios.get(ApiBaseUrl + `categories`)
  const getAllSubcategories = ()=> axios.get(ApiBaseUrl +`subcategories`)

  const getSubCatProducts = () => axios.get(ApiBaseUrl + `products?subCategory=${subCategoryId}&dashboard=true`)
  const getBrandProducts = () => axios.get(ApiBaseUrl + `products?brand=${BrandId}&dashboard=true`)
  const getAllGeneralProducts = () => axios.get(ApiBaseUrl + `products?dashboard=true`)
  const getOnlyBiddingProducts =()=> axios.get(ApiBaseUrl +``)
  let { isLoading: brandsLoading, data: brandsNameResponse } = useQuery('get brands', getAllBrands, { cacheTime: 10000, enabled: !!CategoryName || !!all})
  let { isLoading: categoriesLoading, data: categoriesNameResponse } = useQuery('get categories', getAllCategories, { cacheTime: 10000, enabled: !!CategoryName || !!all})
  let { isLoading: SubcategoriesLoading, data: SubcategoriesNameResponse } = useQuery('get Subcategories', getAllSubcategories, { cacheTime: 10000, enabled: !!SubCategoryName || !!all})
  
  let { isLoading: AllLoading, data: AllResponse , refetch : AllRefetch } = useQuery('get all products for general', getAllGeneralProducts, { cacheTime: 10000, enabled: !!all })
  let { data: SubcatProductsResponse, refetch: SubcatProductsRefetch, isLoading: ProductsLoading } = useQuery('subCategory Products', getSubCatProducts, { cacheTime: 50000, enabled: !!CategoryName })
  let { data: BrandProductsResponse, refetch: BrandProductsRefetch, isLoading: BrandProductsLoading } = useQuery('Brand Products', getBrandProducts, { cacheTime: 50000, enabled: !!BrandName })

  useEffect(() => {
    if (SubcatProductsResponse) {
      setProducts(SubcatProductsResponse?.data.data.data);
      setFilteredProducts(SubcatProductsResponse?.data.data.data);
    } else if (BrandProductsResponse) {
      setProducts(BrandProductsResponse?.data.data.data);
      setFilteredProducts(BrandProductsResponse?.data.data.data);
    }else if (AllResponse) {
      setProducts(AllResponse?.data.data.data);
      setFilteredProducts(AllResponse?.data.data.data);
    }
  }, [SubcatProductsResponse, BrandProductsResponse , AllResponse]);

  // *ANCHOR - delete product
  const deleteProduct = async (id) => {
    setErrMsg(null);
    setLoaderBtn(true)
      await axios.delete(ApiBaseUrl + `products/${id}`, { headers })
      .then(response =>{
      if (CategoryName) {
        SubcatProductsRefetch()
      } else if (BrandName) {
        BrandProductsRefetch()
      }else if (all) {
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
        if (CategoryName) {
          SubcatProductsRefetch();
        } else if (BrandName) {
          BrandProductsRefetch();
        } else if (all) {
          AllRefetch();
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
      type :'',
      value :''
    },
    validationSchema : Yup.object().shape({
      type : Yup.string().required('Discount Type is required'),
      value : Yup.string().required('Discount value is required')
    }),
    onSubmit :(values) => editDiscount( SelectedDiscount ,values)
  })

  // *ANCHOR - Hide Product
  const hideProduct=(status, id)=>{
    setErrMsg(null);
    setLoaderBtn(true)
    axios.patch(ApiBaseUrl +`products/${id}`,{isShown:!status},{headers : headers})
    .then(response=>{
      if (CategoryName) {
        SubcatProductsRefetch()
      } else if (BrandName) {
        BrandProductsRefetch()
      }else if (all) {
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

  // *ANCHOR - hide all modals
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
          {CategoryName && <h3>Products For <span className='cursor-pointer' onClick={() => { navigate(`/SubCategory/${CategoryName}/${categoryId}`) }}>{CategoryName}</span> <i className='pi pi-arrow-right'></i> {SubCategoryName}</h3>}
          {BrandName && <h3>Products For {BrandName} </h3>}
          {all && <h3>All Products</h3>}
        </div>
        <div className="d-flex flex-column">
        <div className="searchCategory mb-2">
          <input type="text" placeholder="Search by product name" className='form-control' onChange={handleSearch} />
        </div>
        <div className="addCategory">
          <button className='btn btn-secondary w-100' onClick={() => { setDisplayAddNewDialog(true) }}>Add New</button>
        </div>
        </div>
      </div>
    )
  }
  const actionTemplate = (rowData) => {
    return (
      <div className='d-flex justify-content-center align-items-center '>
        
        <Button icon="pi pi-pencil" className='TabelButton approve rounded-circle mx-1' onClick={() => { setDisplayEditDialog(true); setSelectedProducts(rowData) }} />
        <BiSolidDiscount  className='TabelButton discount rounded-circle mx-1 p-1' onClick={()=>{setDiscountDialogVisible(true); setSelectedDiscount(rowData._id)}}/>
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
      {brandsLoading || ProductsLoading || BrandProductsLoading || AllLoading || categoriesLoading  || SubcategoriesLoading ? <div>
        <Loader />
      </div> : <>
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
          
          <DiscountDialog Dialog={Dialog} ErrMsg={ErrMsg} LoaderBtn={LoaderBtn} Button={Button} hideDialog={hideDialog}  editDiscountFormik={editDiscountFormik} DiscountDialogVisible={DiscountDialogVisible}/>
      
          <DescriptionDialog Dialog={Dialog} ProductDescriptionVisible={ProductDescriptionVisible} hideDialog={hideDialog} ProductDescription={ProductDescription}/>

          <HideProductDialog Dialog={Dialog} LoaderBtn={LoaderBtn} ErrMsg={ErrMsg} HideDialogVisible={HideDialogVisible} hideDialog={hideDialog} hideProduct={hideProduct} SelectedProducts={SelectedProducts} setHideDialogVisible={setHideDialogVisible}/>
          
          {displayEditDialog &&
            <EditProduct
              SelectedProducts={SelectedProducts}
              displayEditDialog={displayEditDialog}
              headers={headers}
              all={all}
              useFormik={useFormik}
              Yup={Yup}
              subCategoryId={subCategoryId}
              categoryId={categoryId}
              axios={axios}
              ApiBaseUrl={ApiBaseUrl}
              Dialog={Dialog}
              hideDialog={hideDialog}
              Button={Button}
              LoaderBtn={LoaderBtn}
              setLoaderBtn={setLoaderBtn}
              SubcatProductsRefetch={SubcatProductsRefetch}
              AllRefetch={AllRefetch}
              BrandProductsRefetch={BrandProductsRefetch}
              brandsNameResponse={brandsNameResponse?.data.data.data}
              categoriesNameResponse={categoriesNameResponse?.data.data.data}
              SubcategoriesNameResponse={SubcategoriesNameResponse?.data.data.data}
              CategoryName={CategoryName}
              BrandName={BrandName}
              BrandId={BrandId}
            />
          }

          {displayAddNewDialog &&
            <AddProduct
              headers={headers}
              useFormik={useFormik}
              Yup={Yup}
              all={all}
              subCategoryId={subCategoryId}
              categoryId={categoryId}
              axios={axios}
              ApiBaseUrl={ApiBaseUrl}
              Dialog={Dialog}
              displayAddNewDialog={displayAddNewDialog}
              hideDialog={hideDialog}
              Button={Button}
              LoaderBtn={LoaderBtn}
              setLoaderBtn={setLoaderBtn}
              SubcatProductsRefetch={SubcatProductsRefetch}
              AllRefetch={AllRefetch}
              BrandProductsRefetch={BrandProductsRefetch}
              BrandName={BrandName}
              BrandId={BrandId}
              brandsNameResponse={brandsNameResponse?.data.data.data}
              categoriesNameResponse={categoriesNameResponse?.data.data.data}
              SubcategoriesNameResponse={SubcategoriesNameResponse?.data.data.data}
              CategoryName={CategoryName}
            />
          }
        </>
      }
    </div>
  </>
}
