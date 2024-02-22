import React, { useState} from 'react'
import { Helmet } from 'react-helmet'
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import axios from 'axios';
import { ApiBaseUrl } from '../ApiBaseUrl';
import { useQuery } from 'react-query';
import Loader from '../Loader/Loader';

export default function AllUsers({headers}) {

  const [LoaderBtn, setLoaderBtn] = useState(false)
  const [SelectedUser, setSelectedUser] = useState(null)
  const [displayDeleteDialog, setDisplayDeleteDialog] = useState(false)
  const [displaySendAllDialog, setdisplaySendAllDialog] = useState(false)
  const [displayToUser, setdisplayToUser] = useState(false)

  const getAllUsers = ()=> axios.get(ApiBaseUrl + `users`,{headers})
  let {data:UsersResponse , isLoading:UserLoading , refetch:userRefetch} = useQuery("get All Users" , getAllUsers , {cacheTime : 10000})
  console.log(UsersResponse?.data.data.data);

  let SendToAllInitial = {
    title :'', 
    body :'', 
  }

  let SendToAllFormik = useFormik({
    initialValues : SendToAllInitial, 
    validationSchema : Yup.object().shape({
      title :Yup.string().required(' title Is Required') ,
      body :Yup.string().required(' body Is Required') ,
    }),
    onSubmit:(values)=>SendToAll(values)
  })

  const SendToAll = async (values) => {
    setLoaderBtn(true)
    try {
      await axios.post(ApiBaseUrl + `notifications`, values, {headers});
      hideDialog()
      userRefetch()
      setLoaderBtn(false)
    } catch (error) {
      console.error(error);
      setLoaderBtn(false)
    }
  };

  const sendNotificationToUser = async (userId, values) => {
    setLoaderBtn(true);
    try {
      await axios.post(ApiBaseUrl +`notifications/${userId}`, values, {headers});
      hideDialog();
      // Optionally, you can provide feedback to the user indicating the success of the action
      alert("Notification sent successfully!");
    } catch (error) {
      console.error(error);
      // Optionally, handle error and provide feedback to the user
      alert("Failed to send notification. Please try again.");
    } finally {
      setLoaderBtn(false);
    }
  };
  
  const deleteUser =async (id)=>{
    try {
      await axios.delete(ApiBaseUrl + `users/${id}` , { headers })
      userRefetch()
      hideDialog()
    } catch (error) {
      console.error(error);
    }
  }

  const hideDialog = () => {
    setDisplayDeleteDialog(false)
    setdisplaySendAllDialog(false)
    SendToAllFormik.resetForm();
  };

  const actionTemplate = (rowData) => {
    return (
      <div className='d-flex justify-content-center align-items-center '>
        <Button  icon="pi pi-trash" className='TabelButton Cancel rounded-circle mx-1' onClick={() => { setDisplayDeleteDialog(true); setSelectedUser(rowData._id)}} />
        <Button  icon="pi pi-bell" className='TabelButton rounded-circle mx-1' outlined severity="secondary" onClick={() => { setdisplaySendAllDialog(true)}} />
      </div>
    );
  };

  const UsersHeaderBody = ()=>{
    return(
      <div className='d-flex align-items-center justify-content-between'>
        <div className="headerLabel">
          <h3>
            Banners
          </h3>
        </div>
        <div className="addCategory">
          <button className='btn btn-secondary' onClick={()=>{setdisplaySendAllDialog(true)}}>Send All</button>
        </div>
      </div>
    )
  }

  const nameBody = (rowData)=> <h6>{rowData?.firstName} {rowData?.lastName}</h6>

  return <>
    <Helmet>
      <title>Banners</title>
    </Helmet>
    {UserLoading ? <Loader/> : 
    <div className="container">
      <DataTable value={UsersResponse?.data.data.data}  header={UsersHeaderBody} paginator selectionMode="single" className={`dataTabel mb-4 text-capitalize AllList`} dataKey="_id" scrollable scrollHeight="100vh" tableStyle={{ minWidth: "50rem" }} rows={10} responsive="scroll">
        <Column header="Name" body={nameBody} sortable style={{ width: "10%", borderBottom: '1px solid #dee2e6' }} />
        <Column header="email" field='email' sortable style={{ width: "10%", borderBottom: '1px solid #dee2e6' }} />
        <Column header="gender" field='gender' sortable style={{ width: "10%", borderBottom: '1px solid #dee2e6' }} />
        <Column header="phone" field='phone' sortable style={{ width: "10%", borderBottom: '1px solid #dee2e6' }} />
        <Column header="Delete" body={actionTemplate}  style={{ width: "10%", borderBottom: '1px solid #dee2e6' }} />
      </DataTable>
      <Dialog header={'Delete User'} className='container editDialog' visible={displayDeleteDialog} onHide={hideDialog} modal>
        <h5>you want delete this User ?</h5>
        <hr />
        <div className="d-flex align-items-center justify-content-around">
        <button className='btn btn-danger  w-50 mx-2 px-4' onClick={()=>{deleteUser(SelectedUser)}}>Yes</button>
        <button className='btn btn-primary w-50 mx-2  px-4' onClick={()=>{setDisplayDeleteDialog(false)}}>No</button>
        </div>
      </Dialog>  
      <Dialog header={'Send Notification To All Users'} className='container editDialog' visible={displaySendAllDialog} onHide={hideDialog} modal>
        <form onSubmit={SendToAllFormik.handleSubmit} className='bg-light p-3 border shadow-sm rounded'>
              <div className= "form-floating mb-2">
                {/*title input */}
                <input type="text" placeholder='title' className="form-control " id="title" name="title"value={SendToAllFormik.values.title}onChange={SendToAllFormik.handleChange}onBlur={SendToAllFormik.handleBlur}/>
                <label className='ms-2' htmlFor="username">title</label>
                {SendToAllFormik.errors.title && SendToAllFormik.touched.title ? (<div className="alert text-danger">{SendToAllFormik.errors.title}</div>) : null}
              </div>
              <div className= "form-floating mb-2">
                {/*body input */}
                <input type="text" placeholder='body' className="form-control " id="body" name="body"value={SendToAllFormik.values.body}onChange={SendToAllFormik.handleChange}onBlur={SendToAllFormik.handleBlur}/>
                <label className='ms-2' htmlFor="username">Notification Body</label>
                {SendToAllFormik.errors.body && SendToAllFormik.touched.body ? (<div className="alert text-danger">{SendToAllFormik.errors.body}</div>) : null}
              </div>

              <div className="btns ms-auto w-100 d-flex justify-content-center mt-3">
              {LoaderBtn ? <button className='btn btn-primary text-light w-50' disabled><i className="fa fa-spin fa-spinner"></i></button>:
                <Button label="SUBMIT" type="submit" icon="pi pi-check" disabled={!(SendToAllFormik.isValid && SendToAllFormik.dirty)} className="btn btn-primary text-light w-50"/>
              }
              </div>
          </form>
      </Dialog>
      <Dialog header={'Send Notification'} className='container editDialog' visible={displayToUser} onHide={hideDialog} modal>
        <form onSubmit={SendToAllFormik.handleSubmit} className='bg-light p-3 border shadow-sm rounded'>
              <div className= "form-floating mb-2">
                {/*title input */}
                <input type="text" placeholder='title' className="form-control " id="title" name="title"value={SendToAllFormik.values.title}onChange={SendToAllFormik.handleChange}onBlur={SendToAllFormik.handleBlur}/>
                <label className='ms-2' htmlFor="username">title</label>
                {SendToAllFormik.errors.title && SendToAllFormik.touched.title ? (<div className="alert text-danger">{SendToAllFormik.errors.title}</div>) : null}
              </div>
              <div className= "form-floating mb-2">
                {/*body input */}
                <input type="text" placeholder='body' className="form-control " id="body" name="body"value={SendToAllFormik.values.body}onChange={SendToAllFormik.handleChange}onBlur={SendToAllFormik.handleBlur}/>
                <label className='ms-2' htmlFor="username">Notification Body</label>
                {SendToAllFormik.errors.body && SendToAllFormik.touched.body ? (<div className="alert text-danger">{SendToAllFormik.errors.body}</div>) : null}
              </div>

              <div className="btns ms-auto w-100 d-flex justify-content-center mt-3">
              {LoaderBtn ? <button className='btn btn-primary text-light w-50' disabled><i className="fa fa-spin fa-spinner"></i></button>:
                <Button label="SUBMIT" type="submit" icon="pi pi-check" disabled={!(SendToAllFormik.isValid && SendToAllFormik.dirty)} className="btn btn-primary text-light w-50"/>
              }
              </div>
          </form>
      </Dialog>

    </div>
}
    </>
}
