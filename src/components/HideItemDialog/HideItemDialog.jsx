import React from 'react'
export default function HideItemDialog({Dialog ,LoaderBtn, ErrMsg, HideDialogVisible, hideDialog, hide, Selectedtarget, setHideDialogVisible, target}) {
  return <>
              <Dialog header={`Hide ${target}`} className='container editDialog' visible={HideDialogVisible} onHide={hideDialog} modal>
            <h5 className='mb-2'>you want {Selectedtarget?.isShown ? 'Hide' : 'Show'} this {target} ?</h5>
            
            <hr/>
            {ErrMsg ? <div className='alert text-danger'>{ErrMsg}</div> :null}
            <div className="d-flex align-items-center justify-content-around">
              {LoaderBtn ? <button className='btn btn-danger px-4 w-50 mx-2' disabled><i className="fa fa-spin fa-spinner"></i></button> :
              <button className='btn btn-danger px-4 w-50 mx-2' onClick={() => { hide(Selectedtarget.isShown , Selectedtarget._id) }}>Yes</button>
              }
              <button className='btn btn-primary px-4 w-50 mx-2' onClick={() => { setHideDialogVisible(false) }}>No</button>
            </div>
          </Dialog>

    </>
}
