import React from 'react'
export default function DeleteDialog({Dialog ,LoaderBtn, ErrMsg, displayDeleteDialog, hideDialog, deleteProduct, SelectedProducts, setDisplayDeleteDialog}) {
  return <>
            <Dialog header={'Delete Product'} className='container editDialog' visible={displayDeleteDialog} onHide={hideDialog} modal>
            <h5 className='mb-2'>you want delete this Products ?</h5>
            {ErrMsg ? <div className='alert text-danger'>{ErrMsg}</div> :null}
            <div className="d-flex align-items-center justify-content-around">
              {LoaderBtn ? <button className='btn btn-danger px-4 w-50 mx-2' disabled><i className="fa fa-spin fa-spinner"></i></button> :
              <button className='btn btn-danger px-4 w-50 mx-2' onClick={() => { deleteProduct(SelectedProducts) }}>Yes</button>}
              <button className='btn btn-primary px-4 w-50 mx-2' onClick={() => { setDisplayDeleteDialog(false) }}>No</button>
            </div>
          </Dialog>
    </>
}
