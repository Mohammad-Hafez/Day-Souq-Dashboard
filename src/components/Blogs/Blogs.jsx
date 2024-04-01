import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import axios from 'axios';
import { ApiBaseUrl , ImgBaseURL } from '../ApiBaseUrl';
import { useQuery } from 'react-query';
import Loader from '../Loader/Loader';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import HideItemDialog from '../HideItemDialog/HideItemDialog';

export default function Blogs() {
  const user = localStorage.getItem("DaySooqDashUser") ;
  let headers = { 'Authorization': `Bearer ${user}` };

  const [LoaderBtn, setLoaderBtn] = useState(false);
  const [SelectedBlogs, setSelectedBlogs] = useState(null);
  const [displayDeleteDialog, setDisplayDeleteDialog] = useState(false);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [AllBlogs, setAllBlogs] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [displayAddNewDialog, setDisplayAddNewDialog] = useState(false)
  const [ErrMsg, setErrMsg] = useState(null)
  const getAllBlogs = ()=> axios.get( ApiBaseUrl + `blogs?dashboard=true`,{headers});
  let { data: AllBlogsResponse, isLoading: AllBlogsLoading, refetch: AllBlogsRefetch } = useQuery(
    'All-Blogs',
    getAllBlogs,
    { cacheTime: 50000 }
  );

  useEffect(()=>{
    if (AllBlogsResponse) {
      setAllBlogs(AllBlogsResponse?.data.data.data)
      setFilteredBlogs(AllBlogsResponse?.data.data.data)
    }
  },[AllBlogsResponse])

  const handleSearch = (e) => {
    const inputValue = e.target.value.trim();
    setSearchValue(inputValue);
    const filteredData = AllBlogs.filter(
      (Blog) => Blog.author.toLowerCase().startsWith(inputValue) 
    );
    setFilteredBlogs(filteredData);
  };

  let AddNewInitial = {
    title :'', 
    content :'', 
    author :'', 
    type :'', 
    image : ''
  }

  let AddNewFormik = useFormik({
    initialValues : AddNewInitial, 
    validationSchema : Yup.object().shape({
      title :Yup.string().required('Blog title Is Required') ,
      content :Yup.string().required('Blog content Is Required') ,
      author :Yup.string().required('Blog author Is Required') ,
      type :Yup.string().required('Blog Type Is Required') ,
      image : Yup.mixed().required('Blog Image is Required')
    }),
    onSubmit:(values)=>AddNewBlog(values)
  })

  const AddNewBlog = (values) => {
    setLoaderBtn(true)
    setErrMsg(null);
    const AddformData = new FormData();
    AddformData.append('title', values.title);
    AddformData.append('content', values.content);
    AddformData.append('author', values.author);
    AddformData.append('type', values.type);
    AddformData.append('image', values.image); 
    axios.post(ApiBaseUrl + `blogs`, AddformData, { headers })
    .then(response=>{
      hideDialog()
      AllBlogsRefetch()
      setLoaderBtn(false)
    }).catch (error=>{
      setErrMsg(error.response.data.message);
      console.error(error);
      setLoaderBtn(false)
    })
  };

  const [HideDialogVisible, setHideDialogVisible] = useState(false)
  const hide=(status, id)=>{
    setErrMsg(null);
    setLoaderBtn(true)
    axios.patch(ApiBaseUrl +`blogs/${id}`,{isShown:!status},{headers : headers})
    .then(response=>{
      AllBlogsRefetch()
      hideDialog()
      setLoaderBtn(false)
    }).catch (error =>{
      setErrMsg(error.response.data.message);
      console.error(error);
      setLoaderBtn(false)
    })
  }

  const deleteBlog = async (id) => {
    setLoaderBtn(true);
    try {
      await axios.delete(ApiBaseUrl + `blogs/${id}`, {headers});
      AllBlogsRefetch();
      hideDialog();
    } catch (error) {
      console.error(error);
    } finally {
      setLoaderBtn(false);
    }
  };

  const hideDialog = () => {
    setDisplayDeleteDialog(false);
    setHideDialogVisible(false);
    setSelectedBlogs(null);
    setErrMsg(null);
    setLoaderBtn(false)
    setDisplayAddNewDialog(false)
    AddNewFormik.resetForm()
  };

  const actionTemplate = (rowData) => {
    return (
      <div className='d-flex justify-content-center align-items-center'>
        {rowData.isShown === true ? 
          <Button onClick={() => {setSelectedBlogs(rowData); setHideDialogVisible(true)}} icon="pi pi-lock-open" className='TabelButton rounded-circle mx-auto' outlined severity="secondary" />
        :
          <Button onClick={() => {setSelectedBlogs(rowData); setHideDialogVisible(true)}} icon="pi pi-lock" className='TabelButton rounded-circle mx-auto' outlined severity="secondary" />
        }
        <Button icon="pi pi-trash" className='TabelButton Cancel rounded-circle mx-1' onClick={() => { setDisplayDeleteDialog(true); setSelectedBlogs(rowData._id) }} />
      </div>
    );
  };

  const dateBody = (rowData) => <span>{rowData?.createdAt?.slice(0, 10)}</span>;

  const BlogsHeader = ()=>{
    return(
      <div className='d-flex align-items-center justify-content-between'>
        <div className="headerLabel">
          <h3>
            All Blogs
          </h3>
        </div>
        <div className="d-flex flex-column">
          <div className="p-inputgroup w-auto mb-2">
            <span className="p-inputgroup-addon">
              <i className="pi pi-search" />
            </span>
            <input type="text" className="p-inputtext rounded-start-0" placeholder="Search by author" value={searchValue} onChange={handleSearch} />
          </div>
          <div className="addBlog">
          <button className='btn btn-secondary w-100' onClick={()=>{setDisplayAddNewDialog(true)}}>Add New</button>
          </div>

        </div>  
      </div>
  ) }

  const blogImage = (rowData) => {
    return rowData.image ? <img src={ImgBaseURL + rowData.image} alt={rowData.name + ' image'} className='w-50' /> : null;
  };

  return <>
      <Helmet>
        <title>BLOGS</title>
      </Helmet>
      {AllBlogsLoading ? <Loader />  : 
        <div className="container-fluid">
          <DataTable
            value={filteredBlogs}
            header={BlogsHeader}
            paginator
            selectionMode="single"
            className={`dataTabel mb-4 text-capitalize AllList`}
            dataKey="_id"
            scrollable
            scrollHeight="calc(100vh - 200px)"
            tableStyle={{ minWidth: "50rem" }}
            rows={10}
            responsive="scroll"
          >
        <Column header="image" body={blogImage} style={{ width: "10%", bBlogBottom: '1px solid #dee2e6' }} />
        <Column header="content" field='content' style={{ width: "30%", bBlogBottom: '1px solid #dee2e6' }} />
        <Column header="title" field='title' style={{ width: "15%", bBlogBottom: '1px solid #dee2e6' }} />
        <Column header="type" field='type' style={{ width: "10%", bBlogBottom: '1px solid #dee2e6' }} />
        <Column header="author" field='author' style={{ width: "5%", bBlogBottom: '1px solid #dee2e6' }} />
        <Column header="Date" sortable body={dateBody} style={{ width: "10%", bBlogBottom: '1px solid #dee2e6' }} />
        <Column header="Delete" body={actionTemplate}  style={{ width: "5%", bBlogBottom: '1px solid #dee2e6' }} />
          </DataTable>

        <Dialog header={'Delete Blog'} className='container editDialog' visible={displayDeleteDialog} onHide={hideDialog} modal>
        <h5>you want delete this Blog ?</h5>
        <hr />
        {ErrMsg ? <div className='alert text-danger'>{ErrMsg}</div> :null}
        <div className="d-flex align-items-center justify-content-around">
        {LoaderBtn ? <button className='btn btn-danger  w-50 mx-2 px-4' disabled><i className='fa fa-spin fa-spinner'></i></button>: 
        <button className='btn btn-danger  w-50 mx-2 px-4' onClick={()=>{deleteBlog(SelectedBlogs)}}>Yes</button>}
        <button className='btn btn-primary w-50 mx-2  px-4' onClick={()=>{setDisplayDeleteDialog(false)}}>No</button>
        </div>
        </Dialog>  

      <Dialog header={'Add New Banner'} className='container editDialog' visible={displayAddNewDialog} onHide={hideDialog} modal>
        <form onSubmit={AddNewFormik.handleSubmit} className='bg-light p-3 border shadow-sm rounded'>
              <div className= "form-floating mb-2">
                {/*title input */}
                <input type="text" placeholder='title' className="form-control " id="title" name="title"value={AddNewFormik.values.title}onChange={AddNewFormik.handleChange}onBlur={AddNewFormik.handleBlur}/>
                <label className='ms-2' htmlFor="username">title</label>
                {AddNewFormik.errors.title && AddNewFormik.touched.title ? (<div className="alert text-danger">{AddNewFormik.errors.title}</div>) : null}
              </div>
              <div className= "form-floating mb-2">
                {/*content input */}
                <input type="text" placeholder='content' className="form-control " id="content" name="content"value={AddNewFormik.values.content}onChange={AddNewFormik.handleChange}onBlur={AddNewFormik.handleBlur}/>
                <label className='ms-2' htmlFor="username">content</label>
                {AddNewFormik.errors.content && AddNewFormik.touched.content ? (<div className="alert text-danger">{AddNewFormik.errors.content}</div>) : null}
              </div>
              <div className= "form-floating mb-2">
                {/*author input */}
                <input type="text" placeholder='author' className="form-control " id="author" name="author"value={AddNewFormik.values.author}onChange={AddNewFormik.handleChange}onBlur={AddNewFormik.handleBlur}/>
                <label className='ms-2' htmlFor="username">author</label>
                {AddNewFormik.errors.author && AddNewFormik.touched.author ? (<div className="alert text-danger">{AddNewFormik.errors.author}</div>) : null}
              </div>
              <div className= "form-floating mb-2">
                {/*type input */}
                <input type="text" placeholder='type' className="form-control " id="type" name="type"value={AddNewFormik.values.type}onChange={AddNewFormik.handleChange}onBlur={AddNewFormik.handleBlur}/>
                <label className='ms-2' htmlFor="username">type</label>
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
              {ErrMsg ? <div className='alert text-danger'>{ErrMsg}</div> :null}
              <div className="btns ms-auto w-100 d-flex justify-content-center mt-3">
              {LoaderBtn ? <button className='btn btn-primary text-light w-50' disabled><i className="fa fa-spin fa-spinner"></i></button>:
                <Button label="SUBMIT" type="submit" icon="pi pi-check" disabled={!(AddNewFormik.isValid && AddNewFormik.dirty)} className="btn btn-primary text-light w-50"/>
              }
              </div>
          </form>
      </Dialog>
      <HideItemDialog Dialog={Dialog} target={'Blog'} LoaderBtn={LoaderBtn} ErrMsg={ErrMsg} HideDialogVisible={HideDialogVisible} hideDialog={hideDialog} hide={hide} Selectedtarget={SelectedBlogs} setHideDialogVisible={setHideDialogVisible}/>

      </div>
    }
    </>
}
