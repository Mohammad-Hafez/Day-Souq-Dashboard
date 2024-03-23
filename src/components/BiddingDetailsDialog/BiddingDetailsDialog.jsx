import axios from 'axios'
import { Dialog } from 'primereact/dialog'
import React, {useState } from 'react'
import { ApiBaseUrl } from '../ApiBaseUrl'
import { useQuery } from 'react-query'

export default function BiddingDetailsDialog({ headers, hideDialog, SelectedProducts, BiddingStatus, DisplayBiddingDialog }) {
  const [LoaderBtn, setLoaderBtn] = useState(false);
  const [ErrMsg, setErrMsg] = useState(null);

  const getEndData = ()=>axios.get(ApiBaseUrl + `biddings/${SelectedProducts}/winner`, { headers });
  const getActiveData =()=>axios.get(ApiBaseUrl + `biddings`, { headers });

  let{data:endBiddingResponse , isLoading:EndBiddingLoader} = useQuery('End-Bidding' , getEndData , {enabled : BiddingStatus !== 'active'})
  let{data:ActiveBiddingResponse , isLoading:ActiveBiddingLoader} = useQuery('Active-Bidding' , getActiveData , {enabled : BiddingStatus !== 'end'})
  console.log('active' , ActiveBiddingResponse);
  console.log('end' , endBiddingResponse);

  const endBidding = async () => {
    try {
      const response = await axios.patch(ApiBaseUrl + `biddings/ended/${SelectedProducts}`,{}, { headers });
      hideDialog()
    } catch (error) {
      console.error(error);
      setErrMsg(error.response.data.message);
    }
  }


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

    const formatDateTime = (dateTimeString) => {
      const options = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
      };
      const formattedDateTime = new Date(dateTimeString).toLocaleString('en-US', options);
      return formattedDateTime;
    };

  return <>
  <Dialog header={BiddingStatus === 'end' ? 'Biding Winner' : (BiddingStatus === 'active' && "Bidding Status") } headerClassName='text-success' className='container editDialog' visible={DisplayBiddingDialog} onHide={hideDialog} modal>
    { (EndBiddingLoader)  ? <div className='text-center w-100'><i className="fa fa-spin fa-spinner mx-auto fs-3"></i></div> : 
        BiddingStatus === 'end' && endBiddingResponse?.data?.winners?.map((bidding , index)=><div className="container" key={index}>
          <h6 className='fs-5 font-roboto pb-2 fw-bold'>Winner : <span>{bidding?.biddingsWinner[0]?.user ? bidding?.biddingsWinner[0]?.user?.firstName +" "+ bidding?.biddingsWinner[0]?.user?.lastName : 'No Winner'}</span></h6>
          <h6 className='fs-5 font-roboto pb-2 fw-bold'>Winner Email : <span>{bidding?.biddingsWinner[0]?.user ? bidding?.biddingsWinner[0]?.user?.email  : null}</span></h6>
          <h6 className='fs-5 font-roboto pb-2 fw-bold'>Winner Id : <span>{bidding?.biddingsWinner[0]?.user ? bidding?.biddingsWinner[0]?.user?._id  : null}</span></h6>
          <hr />
          <h6 className='fs-5 font-roboto pb-2 fw-bold'>Ending Price : <span>{bidding?.biddingsWinner[0]?.user ? bidding?.biddingsWinner[0]?.amount + " JOD"  : null}</span></h6>
          {ErrMsg ? <div className='alert text-danger'>{ErrMsg}</div> :null}
            {LoaderBtn ? <button className='btn btn-success w-100' disabled><i className="fa fa-spin fa-spinner"></i></button>
            :<button className='btn btn-success w-100' onClick={()=>sendNotificationToUser(bidding?.biddingsWinner[0]?.user?._id )}>Send Notification</button>}
        </div>
        )}
    {(ActiveBiddingLoader) ? <div className='text-center w-100'><i className="fa fa-spin fa-spinner mx-auto fs-3"></i></div> : 
             BiddingStatus === 'active' && ActiveBiddingResponse?.data.data.data
              .filter(bidding => bidding.variant.product.id === SelectedProducts)
                .map((bidding ,index )=><div className="container" key={index}>
                  <h6 className='fs-5 font-roboto pb-2 fw-bold'>User : <span>{bidding?.user.email }</span></h6>
                  <h6 className='fs-5 font-roboto pb-2 fw-bold'>Amount : <span>{bidding?.amount} JOD</span></h6>
                  <h6 className='fs-5 font-roboto pb-2 fw-bold'>Time: <span>{formatDateTime(bidding?.createdAt)}</span></h6>
                  <hr />
                </div>
                )}
            {BiddingStatus === 'active' &&  <>
            {ErrMsg ? <div className='alert text-danger'>{ErrMsg}</div> :null}
            {LoaderBtn ? <button className='btn btn-success w-100' disabled><i className="fa fa-spin fa-spinner"></i></button>
            :<button className='btn btn-danger w-100' onClick={endBidding}>End Bidding</button>}
            </>
            }
  </Dialog>
    </>
}
