import axios from 'axios'
import { Dialog } from 'primereact/dialog'
import React from 'react'
import { ApiBaseUrl } from '../ApiBaseUrl'
import { useQuery } from 'react-query'

export default function BiddingDetailsDialog({ LoaderBtn, headers, ErrMsg, hideDialog, SelectedProducts, DisplayBiddingDialog}) {
  const getBidding = ()=> axios.get(ApiBaseUrl + ``)
  const getEndWinner = ()=>axios.get(ApiBaseUrl + `biddings/${SelectedProducts}/winner`,{ headers })
  let {data:endBiddingResponse}= useQuery('end Bidding' , getEndWinner)
  return <>
  <Dialog header={'Bidding Details'} className='container editDialog' visible={DisplayBiddingDialog} onHide={hideDialog} modal>
  <p>details</p>
  </Dialog>
    </>
}
