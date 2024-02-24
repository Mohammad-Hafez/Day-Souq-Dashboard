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

export default function ProductVariants({headers}) {

  let {productName , productId} = useParams()

  const [displayEditDialog, setDisplayEditDialog] = useState(false)
  const [displayDeleteDialog, setDisplayDeleteDialog] = useState(false)
  const [displayAddNewDialog, setDisplayAddNewDialog] = useState(false)
  const [SelectedProducts, setSelectedProducts] = useState(null)
  const [LoaderBtn, setLoaderBtn] = useState(false)
  const [Products, setProducts] = useState()

  const fetchProductVariants = ()=> axios.get(ApiBaseUrl + `products/${productId}/variants`)

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
    quantity :Yup.string().required('quantity Is Required') ,
    size :Yup.string().required('size Is Required') ,
    color :Yup.string().required('color Is Required') ,
    extraPrice :Yup.string().required('extraPrice Is Required') ,
    sku :Yup.string().required('sku Is Required') ,
    imageCover: Yup.mixed().required('imageCover Is Required').test( 'fileSize', 'Image file size must be less than 2MB',
      (value) => value && value.size <= 2097152, // 2MB in bytes
    ),
    images: Yup.mixed().required('images Is Required')
  })

  let addFormik = useFormik({
    initialValues :initialVariant ,
    validationSchema , 

  })

  let editFormik = useFormik({
    initialValues : initialVariant, 
    validationSchema , 
    onSubmit:(values)=>editVariant(SelectedProducts._id , values)
  })

  // *ANCHOR - Add new variant
  const addVariant =  (values) => {
    setLoaderBtn(true)
    const formData = new FormData();
    formData.append('quantity', values.quantity);
    formData.append('imageCover', values.imageCover);
    formData.append('size', values.size);
    formData.append('color', values.color);
    formData.append('images', values.images);
    formData.append('sku', values.sku);
    formData.append('extraPrice', values.extraPrice);
    axios.post(ApiBaseUrl + `products/${productId}/variants`, formData, { headers })
      .then( response =>{
      ProductVariantsRefetch()
      setLoaderBtn(false)
      hideDialog()
      }).catch(error => {
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
    formData.append('quantity', values.quantity);
    formData.append('imageCover', values.imageCover);
    formData.append('size', values.size);
    formData.append('color', values.color);
    formData.append('images', values.images);
    formData.append('sku', values.sku);
    formData.append('extraPrice', values.extraPrice);
    axios.patch(ApiBaseUrl + `variants/${id}`, formData, { headers })
    .then( response =>{
      ProductVariantsRefetch()
      setLoaderBtn(false)
      hideDialog()
    }).catch (error => {
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
  const variantAllImages = (rowData) => rowData?.images?.map((image , index) => <img key={index} src={ImgBaseURL + image } alt={rowData.name + 'image'} className='w-50' />).slice(0,1)
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
            <Column header="All Images" body={variantAllImages} style={{ width: "10%", borderBottom: '1px solid #dee2e6' }} />
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
          </>  
      }
    </div>
    </>
}
