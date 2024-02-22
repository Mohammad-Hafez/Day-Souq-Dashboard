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
import { useNavigate, useParams } from 'react-router-dom';
import EditProduct from '../EditProduct/EditProduct';
import AddProduct from '../AddProduct/AddProduct';
import Loader from '../Loader/Loader';

export default function Products({headers}) {

  let navigate = useNavigate()

  let {CategoryName,SubCategoryName,categoryId,subCategoryId ,BrandId, BrandName} = useParams()

  const [displayEditDialog, setDisplayEditDialog] = useState(false)
  const [displayDeleteDialog, setDisplayDeleteDialog] = useState(false)
  const [displayAddNewDialog, setDisplayAddNewDialog] = useState(false)
  const [SelectedProducts, setSelectedProducts] = useState(null)
  const [ProductDescription, setProductDescription] = useState('')
  const [ProductDescriptionDialog, setProductDescriptionDialog] = useState(false)
  const [LoaderBtn, setLoaderBtn] = useState(false)
  const [Products, setProducts] = useState()

  const getAllBrands = ()=> axios.get(ApiBaseUrl + `brands`)
  const getProducts = ()=> axios.get(ApiBaseUrl + `subCategories/${subCategoryId}/products`)
  const getBrandProducts = ()=> axios.get(ApiBaseUrl + `products?brand=${BrandId}`)

  let {isLoading:brandsLoading , data:bransResponse} = useQuery('get brands' , getAllBrands , {cacheTime : 10000 , enabled: !!CategoryName})
  let {data: ProductsResponse , refetch: ProductsRefetch , isLoading: ProductsLoading} = useQuery('subCategory Products' , getProducts , {cacheTime : 50000 , enabled: !!CategoryName})
  let {data: BrandProductsResponse , refetch: BrandProductsRefetch , isLoading: BrandProductsLoading} = useQuery('Brand Products' , getBrandProducts , {cacheTime : 50000 , enabled: !!BrandName})
  
  useEffect(()=>{
    if (ProductsResponse ) {
      setProducts (ProductsResponse?.data.data.data);
    }else if (BrandProductsResponse) {
      setProducts (BrandProductsResponse?.data.data.data);
    }
  },[ProductsResponse , BrandProductsResponse]);

  // *ANCHOR - delete product
  const deleteProduct =async (id)=>{
    try {
      await axios.delete(ApiBaseUrl + `products/${id}` , { headers })
      if (CategoryName) {
        ProductsRefetch()
        } else if (BrandName) {
          BrandProductsRefetch()
        }
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
    setProductDescriptionDialog(false);
    setProductDescription('')
  };

  // *ANCHOR - actions at table for each row
  const actionTemplate = (rowData) => {
    return (
      <div className='d-flex justify-content-center align-items-center '>
        <Button  icon="pi pi-pencil" className='TabelButton approve rounded-circle mx-1' onClick={() => {setDisplayEditDialog(true); setSelectedProducts(rowData)}} />
        <Button onClick={()=>navigate(`/Products/${CategoryName}/${rowData?.name}/${rowData._id}`)} icon="pi pi-ban" className='TabelButton rounded-circle mx-auto' outlined severity="secondary" />
        <Button  icon="pi pi-trash" className='TabelButton Cancel rounded-circle mx-1' onClick={() => {setSelectedProducts(rowData._id) ; setDisplayDeleteDialog(true) ; console.log(rowData._id);}} />
      </div>
    );
  };
  // *ANCHOR - image format 
  const productImage = (rowData) => rowData?.variants?.map((variant , index) => <img key={index} src={ImgBaseURL + variant.imageCover } alt={variant.name + 'image'} className='w-50' />).slice(0,1)
  
  const ProductsHeaderBody = ()=>{
    return(
      <div className='d-flex align-items-center justify-content-between'>
        <div className="headerLabel">
          {CategoryName && <h3>Products For {CategoryName} <i className='pi pi-arrow-right'></i> {SubCategoryName}</h3>}
          {BrandName && <h3>Products For {BrandName} </h3>}
        </div>
        <div className="addCategory">
          <button className='btn btn-secondary' onClick={()=>{setDisplayAddNewDialog(true)}}>Add New</button>
        </div>
      </div>
    )
  }
    
  const getProductVariants = (rowData) => <Button onClick={()=>navigate(`/ProductVariants/${rowData?.name}/${rowData._id}`)} icon="pi pi-eye" className='TabelButton dark-blue-text blue-brdr bg-transparent rounded-circle mx-auto'/>
  const productStatus = (rowData) => rowData?.isUsed ? 'Used' : 'New'
  const sizesBody = (rowData) => rowData?.sizes?.map((size , index)=> <span key={index} className='d-block'>{size}</span>)
  const descriptionBody = (rowData) => <Button onClick={()=>{setProductDescription(rowData.description) ;setProductDescriptionDialog(true) }} icon="pi pi-eye" className='TabelButton dark-blue-text blue-brdr bg-transparent rounded-circle mx-auto'/>

  return <>
    <Helmet>
      <title>Products</title>
    </Helmet>
    <div className="container-fluid">
      {brandsLoading || ProductsLoading || BrandProductsLoading? <div>
        <Loader/>
      </div> :<>
          <DataTable  value={Products}  header={ProductsHeaderBody} paginator selectionMode="single" className={`dataTabel mb-4 text-capitalize AllList`} dataKey="_id" scrollable scrollHeight="100vh" tableStyle={{ minWidth: "50rem" }} rows={10} responsive="scroll">
            <Column header="Images" body={productImage} style={{ width: "8%", borderBottom: '1px solid #dee2e6' }} />
            <Column field="name" header="Name" sortable style={{ width: "20%", borderBottom: '1px solid #dee2e6' }} />
            <Column header="description" body={descriptionBody} sortable style={{ width: "5%", borderBottom: '1px solid #dee2e6' }} />
            <Column field="price" header="Price (JOD)" sortable style={{ width: "8%", borderBottom: '1px solid #dee2e6' }} />
            <Column header="sizes" body={sizesBody} sortable style={{ width: "8%", borderBottom: '1px solid #dee2e6' }} />
            <Column field="quantity" header="quantity" sortable style={{ width: "5%", borderBottom: '1px solid #dee2e6' }} />
            <Column header="status" body={productStatus} sortable style={{ width: "5%", borderBottom: '1px solid #dee2e6' }} />
            <Column header="Variants" body={getProductVariants}  style={{ width: "5%", borderBottom: '1px solid #dee2e6' }} />
            {/* {CategoryName === "Auction" && <Column header="Auction" body={RiAuctionLine}  style={{ width: "10%", borderBottom: '1px solid #dee2e6' }} />} */}
            <Column header="edit" body={actionTemplate}  style={{ width: "10%", borderBottom: '1px solid #dee2e6' }} />
          </DataTable>
          <Dialog header={'Delete Product'} className='container editDialog' visible={displayDeleteDialog} onHide={hideDialog} modal>
            <h5>you want delete this Products ?</h5>
            <div className="d-flex align-items-center justify-content-around">
            <button className='btn btn-danger px-4' onClick={()=>{deleteProduct(SelectedProducts)}}>Yes</button>
            <button className='btn btn-primary  px-4' onClick={()=>{setDisplayDeleteDialog(false)}}>No</button>
            </div>
          </Dialog> 
          <Dialog header={'Product Description'} className='container editDialog' visible={ProductDescriptionDialog} onHide={hideDialog} modal>
            <div className="cont">
              <h5>
                {ProductDescription}
              </h5>
            </div>
          </Dialog>
          {displayEditDialog && 
          <EditProduct 
          SelectedProducts={SelectedProducts}
          displayEditDialog={displayEditDialog} 
          headers={headers}
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
          ProductsRefetch={ProductsRefetch}
          BrandProductsRefetch={BrandProductsRefetch}
          bransResponse={bransResponse?.data.data.data}
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
            ProductsRefetch={ProductsRefetch}
            BrandProductsRefetch={BrandProductsRefetch}
            BrandName={BrandName}
            BrandId={BrandId}
            bransResponse={bransResponse?.data.data.data}
            CategoryName={CategoryName}
            />
          }
          </>  
      }
    </div>
    </>
}