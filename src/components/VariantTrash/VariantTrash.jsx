import React, { useState } from 'react';
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

export default function VariantTrash() {

  const user = localStorage.getItem("DaySooqDashUser") ;
  let headers = {'Authorization': `Bearer ${user}`};

  const [SelectedProduct, setSelectedProduct] = useState(null);
  const [RestoreProductDialog, setRestoreProductDialog] = useState(false);
  const [DeleteProductDialog, setDeleteProductDialog] = useState(false);
  const [ErrMsg, setErrMsg] = useState(null)
  const [Loading, setLoading] = useState(false)

  const getDeletedProducts = ()=> axios.get(ApiBaseUrl + `variants/deleted` , { headers })
  let {data:deletedProductsResponse , isLoading:DeletedProductsLoad , refetch:deletedProductsRefetch} = useQuery('deleted variants' , getDeletedProducts , {cacheTime:50000})

  const restoreProduct = (id)=>{
    setLoading(true)
    setErrMsg(null)
    try {
      axios.patch(ApiBaseUrl + `variants/restore/${id}`,{}, { headers })
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

  const confirmDeleteProduct = (id)=>{
    setLoading(true)
    setErrMsg(null)
    try {
      axios.delete(ApiBaseUrl + `variants/${id}`, {headers})
      setLoading(false)
      deletedProductsRefetch()
      hideDialog()
    } catch (error) {
      setLoading(false)
      console.error(error);
      setErrMsg(error.message)
    }
  }

  const hideDialog =()=>{
    setLoading(false)
    setErrMsg(null)
    setSelectedProduct(null)
    setDeleteProductDialog(false)
    setRestoreProductDialog(false)
  }
  

  const ProductActionTemplate = (rowData) => {
    return (
      <div className='d-flex justify-content-center align-items-center '>
        <Button icon="pi pi-refresh" className='TabelButton approve rounded-circle mx-1' onClick={() => { setSelectedProduct(rowData._id); setRestoreProductDialog(true); }} />
        <Button icon="pi pi-trash" className='TabelButton Cancel rounded-circle mx-1' onClick={() => { setSelectedProduct(rowData._id); setDeleteProductDialog(true);}} />
      </div>
    );
  };  
  return <>
    <Helmet>
      <title>Trash</title>
    </Helmet>
    {DeletedProductsLoad ? <Loader/> : 
    <div className="container">
        <DataTable value={deletedProductsResponse?.data.data.data} header={"Deleted Variants"} paginator selectionMode="single" className={`dataTabel mb-4 text-capitalize AllList`} dataKey="_id" scrollable scrollHeight="100vh" tableStyle={{ minWidth: "50rem" }} rows={10} responsive="scroll">
          <Column field="sku" header="sku" sortable style={{ width: "10%", borderBottom: '1px solid #dee2e6' }} />
          <Column field="color" header="color" sortable style={{ width: "10%", borderBottom: '1px solid #dee2e6' }} />
          <Column field="current_price" header="Product Price (JOD)" sortable style={{ width: "10%", borderBottom: '1px solid #dee2e6' }} />
          <Column field="extraPrice" header="extra Price (JOD)" sortable style={{ width: "10%", borderBottom: '1px solid #dee2e6' }} />
          <Column header="Actions" body={ProductActionTemplate} style={{ width: "10%", borderBottom: '1px solid #dee2e6' }} />
        </DataTable>
        <RestoreDialog LoaderBtn={Loading} ErrMsg={ErrMsg} displayRestoreDialog={RestoreProductDialog} hideDialog={hideDialog} RestoreProduct={restoreProduct} SelectedProducts={SelectedProduct} setDisplayRestoreDialog={setRestoreProductDialog}/>
        <DeleteDialog  LoaderBtn={Loading} ErrMsg={ErrMsg} displayDeleteDialog={DeleteProductDialog} hideDialog={hideDialog} deleteProduct={confirmDeleteProduct} SelectedProducts={SelectedProduct} setDisplayDeleteDialog={setDeleteProductDialog}/>
    </div>
    }
    </>
}
