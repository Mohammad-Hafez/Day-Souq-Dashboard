import axios from 'axios'
import { Dialog } from 'primereact/dialog'
import React, { useEffect, useState } from 'react'
import { ApiBaseUrl } from '../ApiBaseUrl'
import { useQuery } from 'react-query'

export default function BiddingDetailsDialog({ headers, hideDialog, SelectedProducts, BiddingStatus, DisplayBiddingDialog }) {
  const [LoaderBtn, setLoaderBtn] = useState(false);
  const [ErrMsg, setErrMsg] = useState(null);
  const [endBiddingResponse, setEndBiddingResponse] = useState(null);
  const [EndBiddingLoader, setEndBiddingLoader] = useState(true); // Initially set to true to show loading
  const [EndBiddingFetch, setEndBiddingFetch] = useState(false);

  useEffect(() => {
    if (BiddingStatus === 'end') {
      const fetchData = async () => {
        try {
          const response = await axios.get(ApiBaseUrl + `biddings/${SelectedProducts}/winner`, { headers });
          setEndBiddingResponse(response);
          setEndBiddingFetch(true);
          setEndBiddingLoader(false);
        } catch (error) {
          console.error(error);
          setErrMsg(error.response.data.message);
          setEndBiddingLoader(false);
        }
      };
      fetchData();
    }
  }, [BiddingStatus, SelectedProducts, headers]);


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

  return <>
  <Dialog header={BiddingStatus === 'end' ? 'Biding Winner' : (BiddingStatus === 'active' && "Bidding Status") } headerClassName='text-success' className='container editDialog' visible={DisplayBiddingDialog} onHide={hideDialog} modal>
    {BiddingStatus === 'end' ?
      EndBiddingLoader || !EndBiddingFetch ? <div className='text-center w-100'><i className="fa fa-spin fa-spinner mx-auto fs-3"></i></div> : 
        endBiddingResponse?.data?.winners?.map((bidding , index)=><div className="container" key={index}>
          <h6>Winner : <span>{bidding?.biddingsWinner[0]?.user ? bidding?.biddingsWinner[0]?.user?.firstName +" "+ bidding?.biddingsWinner[0]?.user?.lastName : 'No Winner'}</span></h6>
          <h6>Winner Email : <span>{bidding?.biddingsWinner[0]?.user ? bidding?.biddingsWinner[0]?.user?.email  : null}</span></h6>
          <h6>Winner Id : <span>{bidding?.biddingsWinner[0]?.user ? bidding?.biddingsWinner[0]?.user?._id  : null}</span></h6>
          <hr />
          <h6>Ending Price : <span>{bidding?.biddingsWinner[0]?.user ? bidding?.biddingsWinner[0]?.amount + " JOD"  : null}</span></h6>

          {ErrMsg ? <div className='alert text-danger'>{ErrMsg}</div> :null}
          {LoaderBtn ? <button className='btn btn-success w-100' disabled><i className="fa fa-spin fa-spinner"></i></button>
          :<button className='btn btn-success w-100' onClick={()=>sendNotificationToUser(bidding?.biddingsWinner[0]?.user?._id )}>Send Notification</button>}
        </div>
        ) : null}
  </Dialog>
    </>
}
