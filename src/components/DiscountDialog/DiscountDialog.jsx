import React from 'react'
export default function DiscountDialog({Dialog , ErrMsg , LoaderBtn, Button, hideDialog, editDiscountFormik, DiscountDialogVisible}) {
  return <>
          <Dialog header={'Edit Product Discount'} className='container editDialog' visible={DiscountDialogVisible} onHide={hideDialog} modal>
            <div className="container">
              <form className='bg-light p-3 border shadow-sm rounded' onSubmit={editDiscountFormik.handleSubmit}>
                <div className="form-floating mb-2">
                  <select className="form-select" id="type" name="type" value={editDiscountFormik.values.type} onChange={editDiscountFormik.handleChange} onBlur={editDiscountFormik.handleBlur}>
                    <option value="" disabled>Select Discount Type</option>
                    <option value='fixed'>fixed</option>
                    <option value='percentage'>percentage</option>
                  </select>
                  <label className='ms-2' htmlFor="type">Type</label>
                  {editDiscountFormik.errors.type && editDiscountFormik.touched.type && <div className="alert text-danger">{editDiscountFormik.errors.type}</div>}
                </div>

                <div className="form-floating mb-2">
                  <input type="text" placeholder='value' className="form-control" id="value" name="value" value={editDiscountFormik.values.value} onChange={editDiscountFormik.handleChange} onBlur={editDiscountFormik.handleBlur} />
                  <label className='ms-2' htmlFor="value">Value</label>
                  {editDiscountFormik.errors.value && editDiscountFormik.touched.value && <div className="alert text-danger">{editDiscountFormik.errors.value}</div>}
                </div>

                {ErrMsg ? <div className='alert text-danger'>{ErrMsg}</div> : null}
                <div className="btns ms-auto w-100 d-flex justify-content-center mt-3">
                  {LoaderBtn ? <button className='btn btn-primary text-light w-50' disabled><i className="fa fa-spin fa-spinner"></i></button> :
                    <Button label="SUBMIT" type="submit" icon="pi pi-check" disabled={!editDiscountFormik.isValid} className="btn btn-primary text-light w-50" />
                  }
                </div>
              </form>
            </div>
          </Dialog>

    </>
}
