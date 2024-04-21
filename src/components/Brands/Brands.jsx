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
import { useNavigate } from 'react-router-dom';
import Loader from '../Loader/Loader';
import HideItemDialog from '../HideItemDialog/HideItemDialog';

export default function Brands() {
  const user = localStorage.getItem("DaySooqDashUser") ;
  let headers = { 'Authorization': `Bearer ${user}` };

  let navigate = useNavigate();
  const [displayEditDialog, setDisplayEditDialog] = useState(false);
  const [displayDeleteDialog, setDisplayDeleteDialog] = useState(false);
  const [displayAddNewDialog, setDisplayAddNewDialog] = useState(false);
  const [SelectedBrand, setSelectedBrand] = useState(null);
  const [LoaderBtn, setLoaderBtn] = useState(false);
  const [Brands, setBrands] = useState([]);
  const [filteredBrands, setFilteredBrands] = useState([]);
  const [ErrMsg, setErrMsg] = useState(null);
  const [HideDialogVisible, setHideDialogVisible] = useState(false)

  const getBrands = () => axios.get(ApiBaseUrl + `brands?dashboard=true`);
  let { data, refetch , isLoading } = useQuery('All-Brands', getBrands, { cacheTime: 50000 });
  useEffect(() => {
    if (data) {
      setBrands(data?.data.data.data);
      setFilteredBrands(data?.data.data.data);
    }
  }, [data]);

  // Handle search functionality
  const handleSearch = (e) => {
    const searchValue = e.target.value.toLowerCase();
    const filteredData = Brands.filter((brand) =>
      brand.name.toLowerCase().includes(searchValue)
    );
    setFilteredBrands(filteredData);
  };
  
  let AddNewInitial = {
    name :'', 
    image : ''
  }

  let AddNewFormik = useFormik({
    initialValues : AddNewInitial, 
    validationSchema : Yup.object().shape({
      name :Yup.string().required('Brand Name Is Required') ,
      // image : Yup.string().required('Brand Image is Required')
    }),
    onSubmit:(values)=>AddNewBrand(values)
  })
  const AddNewBrand = (values) => {
    setErrMsg(null);
    setLoaderBtn(true)
    const AddformData = new FormData();
    AddformData.append('name', values);
    // AddformData.append('image', values.image); 
    axios.post(ApiBaseUrl + `brands`, AddformData, { headers })
    .then(response=>{
      hideDialog()
      refetch()
      setLoaderBtn(false)
    }).catch (error=>{
      setErrMsg(error.response.data.message);
      console.error(error);
      setLoaderBtn(false)
    })
  };

  // const addAll = ()=>{
  //   let apiBrand = data?.data.data.data.map(b=>b.name)
  //   let allBrand = brands.map(brand=> brand.name)
  //   let nonDuplicatedBrands = allBrand.filter(brand => !apiBrand.includes(brand));
  //   console.log("api=>" , apiBrand);
  //   console.log("allBrand=>" , allBrand);
  //   console.log(nonDuplicatedBrands);
  //   nonDuplicatedBrands.map(brand=>AddNewBrand(brand))
  // }
  let editInitial = {
    name :'', 
    image : ''

  }

  let editFormik = useFormik({
    initialValues : editInitial, 
    validationSchema : Yup.object().shape({
      name :Yup.string().required('Brand Name Is Required') ,
      image : Yup.string().required('Brand Image is Required')
    }),
    onSubmit:(values)=>editBrand(SelectedBrand._id , values)
  })

  useEffect(()=>{
    if (SelectedBrand) {
      editFormik.setValues( {
        name: SelectedBrand.name,
        image: ''
      }  )
    }
  },[SelectedBrand]);

  const editBrand = async (id, values) => {
    setLoaderBtn(true)
    setErrMsg(null);
    const editFormData = new FormData();
    editFormData.append('name', values.name);
    editFormData.append('image', values.image); 
    axios.patch(ApiBaseUrl + `brands/${id}`, editFormData, { headers })
    .then(response=>{
      hideDialog()
      refetch()
      setLoaderBtn(false)
    }).catch (error=>{
      setErrMsg(error.response.data.message);
      console.error(error);
      setLoaderBtn(false)
    })
  };
  
  const hide=(status, id)=>{
    setErrMsg(null);
    setLoaderBtn(true)
    axios.patch(ApiBaseUrl +`brands/${id}`,{isShown:!status},{headers : headers})
    .then(response=>{
      refetch()
      hideDialog()
      setLoaderBtn(false)
    }).catch (error =>{
      setErrMsg(error.response.data.message);
      console.error(error);
      setLoaderBtn(false)
    })
  }

  const deleteBrand =(id)=>{
    setErrMsg(null);
    setLoaderBtn(true)
    axios.delete(ApiBaseUrl + `brands/${id}` , { headers })
    .then(response=>{
      refetch()
      hideDialog()
      setLoaderBtn(false)
    }).catch (error=>{
      setErrMsg(error.response.data.message);
      console.error(error);
      setLoaderBtn(false)
    })
  }
  
  const actionTemplate = (rowData) => {
    return (
      <div className='d-flex justify-content-center align-items-center '>
        <Button  icon="pi pi-pencil" className='TabelButton approve rounded-circle mx-1' onClick={() => {setDisplayEditDialog(true); setSelectedBrand(rowData)}} />
        {rowData.isShown === true ? 
          <Button onClick={() => {setSelectedBrand(rowData); setHideDialogVisible(true)}} icon="pi pi-lock-open" className='TabelButton rounded-circle mx-auto' outlined severity="secondary" />
        :
          <Button onClick={() => {setSelectedBrand(rowData); setHideDialogVisible(true)}} icon="pi pi-lock" className='TabelButton rounded-circle mx-auto' outlined severity="secondary" />
        }
        <Button  icon="pi pi-trash" className='TabelButton Cancel rounded-circle mx-1' onClick={() => {setSelectedBrand(rowData._id) ; setDisplayDeleteDialog(true)}} />
      </div>
    );
  };

  const brandImage = (rowData) => {
    return rowData.image ? <img src={ImgBaseURL + rowData.image} alt={rowData.name + ' image'} className='w-25' /> : null;
  };
  
  const createdAtBody = (rowData) => {
    return rowData.createdAt ? rowData.createdAt.slice(0, 10) : null;
  };

  const hideDialog = () => {
    setDisplayEditDialog(false);
    setDisplayDeleteDialog(false);
    setDisplayAddNewDialog(false);
    setHideDialogVisible(false);
    setErrMsg(null);
    setLoaderBtn(false)
    editFormik.resetForm();
    AddNewFormik.resetForm();
  };

  const brandssHeaderBody = () => {
    return (
      <div className="d-flex align-items-center justify-content-between">
        <div className="headerLabel">
          <h3>All Brands</h3>
          {/* <button className='btn btn-success' onClick={addAll}>add all</button> */}
        </div>
        <div className="d-flex flex-column">
        <div className="searchBrand mb-2">
          <input
            type="text"
            placeholder="Search by brand name"
            className="form-control"
            onChange={handleSearch}
          />
        </div>
        <div className="addBrand">
          <button className="btn btn-secondary w-100" onClick={() => { setDisplayAddNewDialog(true); }} >
            Add New
          </button>
        </div>
        </div>
      </div>
    );
  };

  const getBrandProducts = (rowData)=> <Button onClick={()=>navigate(`/Products/brand/${rowData.name}/${rowData._id}`)} icon="pi pi-eye" className='TabelButton dark-blue-text blue-brdr bg-transparent rounded-circle mx-auto'/>
  
  return <>
    <Helmet>
      <title>Brands</title>
    </Helmet>
    {isLoading ? <Loader/> :
    <div className="container">
      <DataTable value={filteredBrands} header={brandssHeaderBody} paginator selectionMode="single" className={`dataTabel mb-4 text-capitalize AllList`} dataKey="_id" scrollable scrollHeight="100vh" tableStyle={{ minWidth: "50rem" }} rows={10} responsive="scroll">
        <Column field="image" header="Image" body={brandImage} style={{ width: "10%", borderBottom: '1px solid #dee2e6' }} />
        <Column field="name" header="Name" sortable style={{ width: "10%", borderBottom: '1px solid #dee2e6' }} />
        <Column field="_id" header="ID" sortable style={{ width: "10%", borderBottom: '1px solid #dee2e6' }} />
        <Column field="createdAt" header="Created At" body={createdAtBody} sortable style={{ width: "10%", borderBottom: '1px solid #dee2e6' }} />
        <Column header="Products" body={getBrandProducts}  style={{ width: "10%", borderBottom: '1px solid #dee2e6' }} />
        <Column header="edit" body={actionTemplate}  style={{ width: "10%", borderBottom: '1px solid #dee2e6' }} />
      </DataTable>
      <Dialog header={'Edit Brands'} className='container editDialog' visible={displayEditDialog} onHide={hideDialog} modal>
          <form onSubmit={editFormik.handleSubmit} className='bg-light p-3 border shadow-sm rounded'>
              <div className= "form-floating mb-2">
                {/*name input */}
                <input type="text" placeholder='Name' className="form-control " id="name" name="name"value={editFormik.values.name}onChange={editFormik.handleChange}onBlur={editFormik.handleBlur}/>
                <label className='ms-2' htmlFor="username">NAME</label>
                {editFormik.errors.name && editFormik.touched.name ? (<div className="alert text-danger ">{editFormik.errors.name}</div>) : null}
              </div>
              <div className="mb-2">
                {/* image input */}
                <input
                  type="file"
                  accept="image/*"
                  className='form-control w-100'
                  onChange={(e) => {
                    editFormik.setFieldValue('image', e.target.files[0]);
                    editFormik.handleChange(e);
                  }}
                />
                {editFormik.errors.image && editFormik.touched.image ? (
                  <div className="alert text-danger  py-1">{editFormik.errors.image}</div>
                ) : null}
              </div>
              {ErrMsg ? <div className='alert text-danger'>{ErrMsg}</div> :null}
              <div className="btns ms-auto w-100 d-flex justify-content-center mt-3">
              {LoaderBtn ? <button className='btn btn-primary text-light w-50' disabled><i className="fa fa-spin fa-spinner"></i></button>:
                <Button label="SUBMIT" type="submit" icon="pi pi-check" disabled={!(editFormik.isValid && editFormik.dirty)} className="btn btn-primary text-light w-50"/>
              }
              </div>
          </form>
      </Dialog>
      <Dialog header={'Delete Brands'} className='container editDialog' visible={displayDeleteDialog} onHide={hideDialog} modal>
        <h5>you want delete this Brand ?</h5>
        <hr />
        {ErrMsg ? <div className='alert text-danger'>{ErrMsg}</div> :null}
        <div className="d-flex align-items-center justify-content-around">
        <button className='btn w-50 mx-2 btn-danger px-4' onClick={()=>{deleteBrand(SelectedBrand)}}>Yes</button>
        <button className='btn w-50 mx-2 btn-primary  px-4' onClick={()=>{setDisplayDeleteDialog(false)}}>No</button>
        </div>
      </Dialog>  
      <Dialog header={'Add New Brands'} className='container editDialog' visible={displayAddNewDialog} onHide={hideDialog} modal>
        <form onSubmit={AddNewFormik.handleSubmit} className='bg-light p-3 border shadow-sm rounded'>
              <div className= "form-floating mb-2">
                {/*name input */}
                <input type="text" placeholder='Name' className="form-control " id="name" name="name"value={AddNewFormik.values.name}onChange={AddNewFormik.handleChange}onBlur={AddNewFormik.handleBlur}/>
                <label className='ms-2' htmlFor="username">NAME</label>
                {AddNewFormik.errors.name && AddNewFormik.touched.name ? (<div className="alert text-danger ">{AddNewFormik.errors.name}</div>) : null}
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
                  <div className="alert text-danger  py-1">{AddNewFormik.errors.image}</div>
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
      <HideItemDialog Dialog={Dialog} target={'Brand'} LoaderBtn={LoaderBtn} ErrMsg={ErrMsg} HideDialogVisible={HideDialogVisible} hideDialog={hideDialog} hide={hide} Selectedtarget={SelectedBrand} setHideDialogVisible={setHideDialogVisible}/>
    </div>
    }
    </>
}
 let brands = [
  {
   "name": "FEEX"
  },
  {
   "name": "ANKER"
  },
  {
   "name": "Promate"
  },
  {
   "name": "VIKUSHA"
  },
  {
   "name": "HUAWEI"
  },
  {
   "name": "Belkin"
  },
  {
   "name": "RAV Power"
  },
  {
   "name": "APPLE"
  },
  {
   "name": "WIWU"
  },
  {
   "name": "Funko"
  },
  {
   "name": "Xiaomi"
  },
  {
   "name": "Divoom"
  },
  {
   "name": "Dell"
  },
  {
   "name": "PICOCICI"
  },
  {
   "name": "JOYROOM"
  },
  {
   "name": "MyCandy"
  },
  {
   "name": "Rockrose"
  },
  {
   "name": "Samsung"
  },
  {
   "name": "SONY"
  },
  {
   "name": "Mpow"
  },
  {
   "name": "JBL"
  },
  {
   "name": "Google"
  },
  {
   "name": "Mcdodo"
  },
  {
   "name": "Nothing Ear 2"
  },
  {
   "name": "MOMAX"
  },
  {
   "name": "COTEETCI"
  },
  {
   "name": "Galaxy"
  },
  {
   "name": "GREEN"
  },
  {
   "name": "VIVA"
  },
  {
   "name": "Keephone"
  },
  {
   "name": "Green Lion"
  },
  {
   "name": "TOTU"
  },
  {
   "name": "Santa Barbara"
  },
  {
   "name": "Yesido"
  },
  {
   "name": "XUNDD"
  },
  {
   "name": "PATHFINDER"
  },
  {
   "name": "KAZE"
  },
  {
   "name": "Youngkit"
  },
  {
   "name": "UNIQ"
  },
  {
   "name": "Raigor Inverse"
  },
  {
   "name": "Viva Madrid"
  },
  {
   "name": "KZDOO"
  },
  {
   "name": "Ajax"
  },
  {
   "name": "Baseus"
  },
  {
   "name": "XO"
  },
  {
   "name": "Jokade"
  },
  {
   "name": "Choetech"
  },
  {
   "name": "LENYES"
  },
  {
   "name": "HP"
  },
  {
   "name": "Lenovo"
  },
  {
   "name": "LG"
  },
  {
   "name": "AOC"
  },
  {
   "name": "Powerology"
  },
  {
   "name": "vertux"
  },
  {
   "name": "Cooler Master"
  },
  {
   "name": "XPG"
  },
  {
   "name": "Crown"
  },
  {
   "name": "PORODO"
  },
  {
   "name": "YANKEE"
  },
  {
   "name": "MARVO"
  },
  {
   "name": "HYPERX"
  },
  {
   "name": "AULA"
  },
  {
   "name": "TP-Link"
  },
  {
   "name": "Canon"
  },
  {
   "name": "Silicon Power"
  },
  {
   "name": "ADATA"
  },
  {
   "name": "Kingston"
  },
  {
   "name": "IMATION"
  },
  {
   "name": "SANDISK"
  },
  {
   "name": "Vention"
  },
  {
   "name": "Goui"
  },
  {
   "name": "UGREEN"
  },
  {
   "name": "HAING"
  },
  {
   "name": "D-Link"
  },
  {
   "name": "OPPO"
  },
  {
   "name": "Infinix"
  },
  {
   "name": "TECNO"
  },
  {
   "name": "Realme"
  },
  {
   "name": "HONOR"
  },
  {
   "name": "BLACK VIEW"
  },
  {
   "name": "TELCAST"
  },
  {
   "name": "Matex"
  },
  {
   "name": "OnePlus"
  },
  {
   "name": "CONTI"
  },
  {
   "name": "Samix"
  },
  {
   "name": "Braun"
  },
  {
   "name": "PHILIPS"
  },
  {
   "name": "TEKMAZ"
  },
  {
   "name": "PANASONIC"
  },
  {
   "name": "Kenwood"
  },
  {
   "name": "DAEWOO"
  },
  {
   "name": "TEFAL"
  },
  {
   "name": "SONA"
  },
  {
   "name": "SENCOR"
  },
  {
   "name": "SHARP"
  },
  {
   "name": "BLACK & DECKER"
  },
  {
   "name": "Electrolux"
  },
  {
   "name": "Mega"
  },
  {
   "name": "KORKMAZ"
  },
  {
   "name": "BOSCH"
  },
  {
   "name": "CAPTIN"
  },
  {
   "name": "Gold Master"
  },
  {
   "name": "PRINCESS"
  },
  {
   "name": "LEXICAL"
  },
  {
   "name": "Ariete"
  },
  {
   "name": "Geepas"
  },
  {
   "name": "SENCOR Vita"
  },
  {
   "name": "Delonghi"
  },
  {
   "name": "El Capo"
  },
  {
   "name": "Moulinex"
  },
  {
   "name": "DOLCE GUSTO"
  },
  {
   "name": "IL CAPO TOCA"
  },
  {
   "name": "PEDRINI"
  },
  {
   "name": "SEVERIN"
  },
  {
   "name": "Hyundai"
  },
  {
   "name": "QUOKKA"
  },
  {
   "name": "DOORBELL"
  },
  {
   "name": "EZVIZ"
  },
  {
   "name": "ARES"
  },
  {
   "name": "MOFKERA"
  },
  {
   "name": "KS"
  },
  {
   "name": "MAGICAL UNIVERSE"
  },
  {
   "name": "MCFARLANE"
  },
  {
   "name": "SMURFS"
  },
  {
   "name": "THE HANGREES"
  },
  {
   "name": "READY TO ROBOT"
  },
  {
   "name": "NICKELODEON"
  },
  {
   "name": "RIP"
  },
  {
   "name": "SUPERMAG"
  },
  {
   "name": "CYBER STRIKE"
  },
  {
   "name": "JAKKS"
  },
  {
   "name": "MGA ENTERTAINMENT"
  },
  {
   "name": "SPLASH TOYS"
  },
  {
   "name": "RESCUE HEROES"
  },
  {
   "name": "APEX LEGENDS"
  },
  {
   "name": "TINY PONG"
  },
  {
   "name": "FORTNITE"
  },
  {
   "name": "QIXELS"
  }
 ]
