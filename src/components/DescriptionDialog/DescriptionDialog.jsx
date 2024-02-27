import React from 'react'
export default function DescriptionDialog({Dialog , ProductDescriptionVisible , hideDialog , ProductDescription}) {
  return <>
          <Dialog header={'Product Description'} className='container editDialog' visible={ProductDescriptionVisible} onHide={hideDialog} modal>
            <div className="container">
              <h5>
                {ProductDescription}
              </h5>
            </div>
          </Dialog>
    </>
}
