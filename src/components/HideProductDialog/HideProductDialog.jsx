import React from 'react'
export default function HideProductDialog({Dialog ,LoaderBtn, ErrMsg, HideDialogVisible, hideDialog, hideProduct, SelectedProducts, setHideDialogVisible}) {
  return <>
              <Dialog header={'Delete Product'} className='container editDialog' visible={HideDialogVisible} onHide={hideDialog} modal>
            <h5 className='mb-2'>you want Hide this Products ?</h5>
            <hr/>
            {ErrMsg ? <div className='alert text-danger'>{ErrMsg}</div> :null}
            <div className="d-flex align-items-center justify-content-around">
              {LoaderBtn ? <button className='btn btn-danger px-4 w-50 mx-2' disabled><i className="fa fa-spin fa-spinner"></i></button> :
              <button className='btn btn-danger px-4 w-50 mx-2' onClick={() => { hideProduct(SelectedProducts.isShown , SelectedProducts._id) }}>Yes</button>
              }
              <button className='btn btn-primary px-4 w-50 mx-2' onClick={() => { setHideDialogVisible(false) }}>No</button>
            </div>
          </Dialog>

    </>
}
