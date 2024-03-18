import axios from 'axios'
import { Dialog } from 'primereact/dialog'
import React, { useState } from 'react'
import { ApiBaseUrl } from '../ApiBaseUrl'
import { useQuery } from 'react-query'

export default function BiddingDetailsDialog({  headers, hideDialog, SelectedProducts, BiddingStatus, DisplayBiddingDialog }) {
  const [LoaderBtn, setLoaderBtn] = useState(false)
  const [ErrMsg, setErrMsg] = useState(null)

  const sendNotificationToUser = async (userId ) => {
    setLoaderBtn(true);
    setErrMsg(null)
    const values = {
      title: "Congratulations 🎉",
      body: "You Won The Bidding"
    }
      await axios.post(ApiBaseUrl +`notifications/${userId}`, 
      values
      , {headers})
      .then( response =>{ 
        hideDialog()
        setLoaderBtn(false);
      } )
      .catch (error => {
        setErrMsg(error.response.data.message);
        console.error(error);
        setLoaderBtn(false);
      })
    }

  const getEndWinner = ()=>axios.get(ApiBaseUrl + `biddings/${SelectedProducts}/winner`,{ headers })
  let {data:endBiddingResponse , isLoading:EndBiddingLoader , isFetching:EndBiddingFetch}= useQuery('end Bidding' , getEndWinner , {cacheTime:5000 , enabled: BiddingStatus==='end'})
  console.log(endBiddingResponse?.data?.winners[0]?.biddingsWinner);
  return <>
  <Dialog header={BiddingStatus === 'end' ? 'Biding Winner' : (BiddingStatus === 'active' && "Bidding Status") } headerClassName='text-success' className='container editDialog' visible={DisplayBiddingDialog} onHide={hideDialog} modal>
    {BiddingStatus === 'end' ?
      EndBiddingLoader ? "Loading..." : 
        endBiddingResponse?.data?.winners?.map((bidding , index)=><div className="container" key={index}>
          <h6>Winner : <span>{bidding?.biddingsWinner[0]?.user ? bidding?.biddingsWinner[0]?.user?.firstName +" "+ bidding?.biddingsWinner[0]?.user?.lastName : 'No Winner'}</span></h6>
          <h6>Winner Email : <span>{bidding?.biddingsWinner[0]?.user ? bidding?.biddingsWinner[0]?.user?.email  : null}</span></h6>
          <h6>Winner Id : <span>{bidding?.biddingsWinner[0]?.user ? bidding?.biddingsWinner[0]?.user?._id  : null}</span></h6>
          <hr />
          <h6>Ending Price : <span>{bidding?.biddingsWinner[0]?.user ? bidding?.biddingsWinner[0]?.amount + " JOD"  : null}</span></h6>
          <button className='btn btn-success' onClick={()=>sendNotificationToUser(bidding?.biddingsWinner[0]?.user?._id )}>Send Notification</button>
        </div>
        ) : null}
  </Dialog>
    </>
}
