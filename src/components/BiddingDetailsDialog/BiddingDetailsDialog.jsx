import axios from 'axios'
import { Dialog } from 'primereact/dialog'
import React from 'react'
import { ApiBaseUrl } from '../ApiBaseUrl'

export default function BiddingDetailsDialog({ LoaderBtn, headers, ErrMsg, hideDialog, SelectedProducts, DisplayBiddingDialog}) {
  const getBidding = ()=> axios.get(ApiBaseUrl + ``)
  return <>
  <Dialog header={'Bidding Details'} className='container editDialog' visible={DisplayBiddingDialog} onHide={hideDialog} modal>
  <p>details</p>
  </Dialog>
    </>
}
