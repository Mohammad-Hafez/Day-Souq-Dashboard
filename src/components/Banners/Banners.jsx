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
import Loader from '../Loader/Loader';

export default function Banners({headers}) {
  const [LoaderBtn, setLoaderBtn] = useState(false)
  const [SelectedBanner, setSelectedBanner] = useState(null)
  const [displayDeleteDialog, setDisplayDeleteDialog] = useState(false)
  const [displayAddNewDialog, setDisplayAddNewDialog] = useState(false)

  const getBanners = () => axios.get(ApiBaseUrl + `banners`)
  let {data: bannerResponse , isLoading : bannerLoading  , refetch:bannerRefetch} = useQuery('get banners' , getBanners , {cacheTime : 10000})
  console.log(bannerResponse?.data.data.data);
  let AddNewInitial = {
    description :'', 
    type :'', 
    image : ''

  }

  let AddNewFormik = useFormik({
    initialValues : AddNewInitial, 
    validationSchema : Yup.object().shape({
      description :Yup.string().required('Banner Description Is Required') ,
      type :Yup.string().required('Banner Type Is Required') ,
      image : Yup.string().required('Banner Image is Required')
    }),
    onSubmit:(values)=>AddNewBanner(values)
  })
  const AddNewBanner = async (values) => {
    setLoaderBtn(true)
    const AddformData = new FormData();
    AddformData.append('description', values.description);
    AddformData.append('type', values.type);
    AddformData.append('image', values.image); 
    try {
      await axios.post(ApiBaseUrl + `banners`, AddformData, { headers });
      hideDialog()
      bannerRefetch()
      setLoaderBtn(false)
    } catch (error) {
      console.error(error);
      setLoaderBtn(false)
    }
  };
  
  const deleteBanner =async (id)=>{
    try {
      await axios.delete(ApiBaseUrl + `banners/${id}` , { headers })
      bannerRefetch()
      hideDialog()
    } catch (error) {
      console.error(error);
    }
  }

  const hideDialog = () => {
    setDisplayDeleteDialog(false)
    setDisplayAddNewDialog(false)
    AddNewFormik.resetForm();
  };


  const BannerImage = (rowData)=><img  src={ImgBaseURL + rowData.image } alt={rowData.name + 'image'} className='w-50' />
  const actionTemplate = (rowData) => {
    return (
      <div className='d-flex justify-content-center align-items-center '>
        <Button  icon="pi pi-trash" className='TabelButton Cancel rounded-circle mx-1' onClick={() => { setDisplayDeleteDialog(true); setSelectedBanner(rowData._id)}} />
      </div>
    );
  };

  const BannersHeaderBody = ()=>{
    return(
      <div className='d-flex align-items-center justify-content-between'>
        <div className="headerLabel">
          <h3>
            Banners
          </h3>
        </div>
        <div className="addCategory">
          <button className='btn btn-secondary' onClick={()=>{setDisplayAddNewDialog(true)}}>Add New</button>
        </div>
      </div>
    )
  }

  return <>
    <Helmet>
      <title>Banners</title>
    </Helmet>
    {bannerLoading ? <Loader/> : 
    <div className="container">
      <DataTable value={bannerResponse?.data.data.data}  header={BannersHeaderBody} paginator selectionMode="single" className={`dataTabel mb-4 text-capitalize AllList`} dataKey="_id" scrollable scrollHeight="100vh" tableStyle={{ minWidth: "50rem" }} rows={10} responsive="scroll">
        <Column header="Image" body={BannerImage} style={{ width: "10%", borderBottom: '1px solid #dee2e6' }} />
        <Column header="description" field='description' style={{ width: "10%", borderBottom: '1px solid #dee2e6' }} />
        <Column header="type" field='type' sortable style={{ width: "10%", borderBottom: '1px solid #dee2e6' }} />
        <Column header="Delete" body={actionTemplate}  style={{ width: "10%", borderBottom: '1px solid #dee2e6' }} />
      </DataTable>
      <Dialog header={'Delete Banner'} className='container editDialog' visible={displayDeleteDialog} onHide={hideDialog} modal>
        <h5>you want delete this Banner ?</h5>
        <hr />
        <div className="d-flex align-items-center justify-content-around">
        <button className='btn btn-danger  w-50 mx-2 px-4' onClick={()=>{deleteBanner(SelectedBanner)}}>Yes</button>
        <button className='btn btn-primary w-50 mx-2  px-4' onClick={()=>{setDisplayDeleteDialog(false)}}>No</button>
        </div>
      </Dialog>  
      <Dialog header={'Add New Banner'} className='container editDialog' visible={displayAddNewDialog} onHide={hideDialog} modal>
        <form onSubmit={AddNewFormik.handleSubmit} className='bg-light p-3 border shadow-sm rounded'>
              <div className= "form-floating mb-2">
                {/*description input */}
                <input type="text" placeholder='description' className="form-control " id="description" name="description"value={AddNewFormik.values.description}onChange={AddNewFormik.handleChange}onBlur={AddNewFormik.handleBlur}/>
                <label className='ms-2' htmlFor="username">description</label>
                {AddNewFormik.errors.description && AddNewFormik.touched.description ? (<div className="alert text-danger">{AddNewFormik.errors.description}</div>) : null}
              </div>
              <div className= "form-floating mb-2">
                {/*description input */}
                <select
                  className="form-select"
                  id="type"
                  name="type"
                  value={AddNewFormik.values.type}
                  onChange={AddNewFormik.handleChange}
                  onBlur={AddNewFormik.handleBlur}
                >
                  <option value="" disabled>
                    Select type
                  </option>
                  <option value="ads">Ads</option>
                  <option value="slider">Slider</option>
                </select>
                <label className='ms-2' htmlFor="username">Type</label>
                {AddNewFormik.errors.type && AddNewFormik.touched.type ? (<div className="alert text-danger">{AddNewFormik.errors.type}</div>) : null}
              </div>
              <div className="mb-2">
                {/* image input */}
                <input
                  type="file"
                  accept="image/*"
                  className='form-control w-100'
                  onChange={(e) => {
                    AddNewFormik.setFieldValue('image', e.target.files[0]);
                    AddNewFormik.handleChange(e);
                  }}
                />
                {AddNewFormik.errors.image && AddNewFormik.touched.image ? (
                  <div className="alert text-danger py-1">{AddNewFormik.errors.image}</div>
                ) : null}
              </div>
              <div className="btns ms-auto w-100 d-flex justify-content-center mt-3">
              {LoaderBtn ? <button className='btn btn-primary text-light w-50' disabled><i className="fa fa-spin fa-spinner"></i></button>:
                <Button label="SUBMIT" type="submit" icon="pi pi-check" disabled={!(AddNewFormik.isValid && AddNewFormik.dirty)} className="btn btn-primary text-light w-50"/>
              }
              </div>
          </form>
      </Dialog>

    </div>
}
    </>
}
