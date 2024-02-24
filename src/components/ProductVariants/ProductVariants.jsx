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

export default function ProductVariants({headers}) {

  let navigate = useNavigate()

  let {productName , productId} = useParams()

  const [displayEditDialog, setDisplayEditDialog] = useState(false)
  const [displayDeleteDialog, setDisplayDeleteDialog] = useState(false)
  const [displayAddNewDialog, setDisplayAddNewDialog] = useState(false)
  const [SelectedProducts, setSelectedProducts] = useState(null)
  const [ProductDescription, setProductDescription] = useState('')
  const [ProductDescriptionDialog, setProductDescriptionDialog] = useState(false)
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
  let editInitial = {
    name :'', 
    image : '',
    price:'',
    description:'',
    brand:'' ,
    subCategory : "" ,
    category : "",
    startDate:"" ,
    biddingPrice :"" ,
    startBidding:"",
    duration:'',
    biddingGap :""
  }
  let editFormik = useFormik({
    initialValues : editInitial, 
    validationSchema : Yup.object().shape({
      name :Yup.string().required('Category Name Is Required') ,
      image: Yup.mixed().optional().test( 'fileSize', 'Image file size must be less than 2MB',
        (value) => value && value.size <= 2097152, // 2MB in bytes
      ),
    }),
    onSubmit:(values)=>editCategory(SelectedProducts._id , values)
  })

  // *NOTE - set selected product values in edit form 
  useEffect(()=>{
    if (SelectedProducts) {
      editFormik.setValues( {
        name: SelectedProducts.name,
        image: ''
      }  )
    }
  },[SelectedProducts]);

  // *NOTE - edit new product function
  const editCategory = async (id, values) => {
    setLoaderBtn(true)
    const formData = new FormData();
    formData.append('name', values.name);
    formData.append('image', values.image); 
    try {
      await axios.patch(ApiBaseUrl + `subcategories/${id}`, formData, { headers });
      ProductVariantsRefetch()
      setLoaderBtn(false)
      hideDialog()
    } catch (error) {
      console.error(error);
      setLoaderBtn(false)
    }
  };
  // *ANCHOR - delete product
  const deleteCategory =async (id)=>{
    try {
      await axios.delete(ApiBaseUrl + `Product/${id}` , { headers })
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
  const productImage = (rowData) => rowData?.variants?.map((variant , index) => <img key={index} src={ImgBaseURL + variant.imageCover } alt={variant.name + 'image'} className='w-50' />).slice(0,1)
  
  const ProductsHeaderBody = ()=>{
    return(
      <div className='d-flex align-items-center justify-content-between'>
        <div className="headerLabel">
          {productName && <h3>Products For {productName} </h3>}
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
            <Column header="Images" body={productImage} style={{ width: "8%", borderBottom: '1px solid #dee2e6' }} />
            <Column field="name" header="Name" sortable style={{ width: "20%", borderBottom: '1px solid #dee2e6' }} />
            <Column header="description" body={descriptionBody} sortable style={{ width: "5%", borderBottom: '1px solid #dee2e6' }} />
            <Column field="price" header="Price (JOD)" sortable style={{ width: "8%", borderBottom: '1px solid #dee2e6' }} />
            <Column header="size" body={sizesBody} sortable style={{ width: "8%", borderBottom: '1px solid #dee2e6' }} />
            <Column field="quantity" header="quantity" sortable style={{ width: "5%", borderBottom: '1px solid #dee2e6' }} />
            <Column header="edit" body={actionTemplate}  style={{ width: "10%", borderBottom: '1px solid #dee2e6' }} />
          </DataTable>
          <Dialog header={'Delete Product'} className='container editDialog' visible={displayDeleteDialog} onHide={hideDialog} modal>
            <h5>you want delete this Products ?</h5>
            <div className="d-flex align-items-center justify-content-around">
            <button className='btn btn-danger px-4' onClick={()=>{deleteCategory(SelectedProducts)}}>Yes</button>
            <button className='btn btn-primary  px-4' onClick={()=>{setDisplayDeleteDialog(false)}}>No</button>
            </div>
          </Dialog> 
          <Dialog header={'Product Description'} className='container editDialog' visible={ProductDescriptionDialog} onHide={hideDialog} modal>
            <div className="cont">
              <h5>
                {ProductDescription}
              </h5>
            </div>
            CategoryName={CategoryName}
            /> */}
          </>  
      }
    </div>
    </>
}
