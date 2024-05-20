import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import axios from 'axios';
import { ApiBaseUrl, ImgBaseURL } from '../ApiBaseUrl';
import { useQuery } from 'react-query';
import Loader from '../Loader/Loader';
import DeleteDialog from '../DelDialog/DelDialog';
import RestoreDialog from '../RestoreDialog/RestoreDialog';

export default function ProductsTrash() {

  const user = localStorage.getItem("DaySooqDashUser") ;
  let headers = {'Authorization': `Bearer ${user}`};

  const [SelectedProduct, setSelectedProduct] = useState(null);
  const [RestoreProductDialog, setRestoreProductDialog] = useState(false);
  const [DeleteProductDialog, setDeleteProductDialog] = useState(false);
  const [ErrMsg, setErrMsg] = useState(null)
  const [Loading, setLoading] = useState(false)

  const getDeletedProducts = ()=> axios.get(ApiBaseUrl + `products/deleted` , { headers })
  let {data:deletedProductsResponse , isLoading:DeletedProductsLoad , refetch:deletedProductsRefetch} = useQuery('deleted products' , getDeletedProducts , {cacheTime:50000})

  const restoreProduct = (id)=>{
    setLoading(true)
    setErrMsg(null)
    try {
      axios.patch(ApiBaseUrl + `products/restore/${id}`,{}, { headers })
      setLoading(false)
      deletedProductsRefetch()
      hideDialog()
    } catch (error) {
      setLoading(false)
      console.error(error);
      console.log('err=>' , error.message);
      setErrMsg(error.message)
    }
  }
useEffect(()=>{
  deletedProductsRefetch()
},[deletedProductsResponse])
  const confirmDeleteProduct = (id)=>{
    setLoading(true)
    setErrMsg(null)
    try {
      axios.delete(ApiBaseUrl + `products/${id}`, {headers})
      setLoading(false)
      deletedProductsRefetch()
      hideDialog()
    } catch (error) {
      setLoading(false)
      console.error(error);
      setErrMsg(error.message)
    }
  }
  const delAll = ()=> deletedProductsResponse?.data?.data?.data?.forEach(element => confirmDeleteProduct(element?._id));

  const hideDialog =()=>{
    setLoading(false)
    setErrMsg(null)
    setSelectedProduct(null)
    setDeleteProductDialog(false)
    setRestoreProductDialog(false)
  }
  
  let prdoductCategory =(rowData)=> <span>{rowData?.subCategory?.category?.name}</span>

  const ProductActionTemplate = (rowData) => {
    return (
      <div className='d-flex justify-content-center align-items-center '>
        <Button icon="pi pi-refresh" className='TabelButton approve rounded-circle mx-1' onClick={() => { setSelectedProduct(rowData._id); setRestoreProductDialog(true); }} />
        <Button icon="pi pi-trash" className='TabelButton Cancel rounded-circle mx-1' onClick={() => { setSelectedProduct(rowData._id); setDeleteProductDialog(true);}} />
      </div>
    );
  };  
const deletedAt = (rowData)=> rowData?.deletedAt?.slice(0,10)

const trashHeader = ()=>{
  return(
    <div className='d-flex justify-content-between align-items-center'>
      <h3>Products Trash</h3>
      {Loading? <button>Load...</button>:
      <button className='btn btn-danger' onClick={delAll}>Delete All</button>
      }
    </div>
  )
}
  return <>
    <Helmet>
      <title>Trash</title>
    </Helmet>
    {DeletedProductsLoad ? <Loader/> : 
    <div className="container">
        <DataTable value={deletedProductsResponse?.data.data.data} header={trashHeader} paginator selectionMode="single" className={`dataTabel mb-4 text-capitalize AllList`} dataKey="_id" scrollable scrollHeight="100vh" tableStyle={{ minWidth: "50rem" }} rows={10} responsive="scroll">
          <Column field="name" header="Name" sortable style={{ width: "10%", borderBottom: '1px solid #dee2e6' }} />
          <Column field="_id" header="id" sortable style={{ width: "10%", borderBottom: '1px solid #dee2e6' }} />
          <Column field="price" header="price (JOD)" sortable style={{ width: "10%", borderBottom: '1px solid #dee2e6' }} />
          <Column header="category" body={prdoductCategory} sortable style={{ width: "10%", borderBottom: '1px solid #dee2e6' }} />
          <Column header="deleted At" body={deletedAt} sortable style={{ width: "10%", borderBottom: '1px solid #dee2e6' }} />
          <Column header="Actions" body={ProductActionTemplate} style={{ width: "10%", borderBottom: '1px solid #dee2e6' }} />
        </DataTable>
        <RestoreDialog LoaderBtn={Loading} ErrMsg={ErrMsg} displayRestoreDialog={RestoreProductDialog} hideDialog={hideDialog} RestoreProduct={restoreProduct} SelectedProducts={SelectedProduct} setDisplayRestoreDialog={setRestoreProductDialog}/>
        <DeleteDialog  LoaderBtn={Loading} ErrMsg={ErrMsg} displayDeleteDialog={DeleteProductDialog} hideDialog={hideDialog} deleteProduct={confirmDeleteProduct} SelectedProducts={SelectedProduct} setDisplayDeleteDialog={setDeleteProductDialog}/>
    </div>
    }
    </>
}
