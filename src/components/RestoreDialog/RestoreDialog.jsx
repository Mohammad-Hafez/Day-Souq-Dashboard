import React from 'react'
import { Dialog } from 'primereact/dialog';

export default function RestoreDialog({LoaderBtn, ErrMsg, displayRestoreDialog, hideDialog, RestoreProduct, SelectedProducts, setDisplayRestoreDialog}) {
  return <>
            <Dialog header={'Restore Product'} className='container editDialog' visible={displayRestoreDialog} onHide={hideDialog} modal>
            <h5 className='mb-2'>you want Restore this Products ?</h5>
            {ErrMsg ? <div className='alert text-danger'>{ErrMsg}</div> :null}
            <div className="d-flex align-items-center justify-content-around">
              {LoaderBtn ? <button className='btn btn-danger px-4 w-50 mx-2' disabled><i className="fa fa-spin fa-spinner"></i></button> :
              <button className='btn btn-danger px-4 w-50 mx-2' onClick={() => { RestoreProduct(SelectedProducts) }}>Yes</button>}
              <button className='btn btn-primary px-4 w-50 mx-2' onClick={() => { setDisplayRestoreDialog(false) }}>No</button>
            </div>
          </Dialog>
    </>
}
