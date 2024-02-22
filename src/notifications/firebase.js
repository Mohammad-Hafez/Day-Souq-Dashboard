// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getMessaging , getToken} from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyAaFOpfMqgKFL8O2Di6dJB2ATXFcQKpWzU",
  authDomain: "day-sooq-notifications.firebaseapp.com",
  projectId: "day-sooq-notifications",
  storageBucket: "day-sooq-notifications.appspot.com",
  messagingSenderId: "678430887753",
  appId: "1:678430887753:web:dea613c5a6ca2b83a8d498",
  measurementId: "G-MCFVD47800"
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export const generateToken =  async () =>{
  const permission = await Notification.requestPermission();
  console.log(permission);
  if (permission === 'granted') {
    const token = await getToken(messaging , 
      {
        vapidKey :
        "BJZy2S1XUGEbmH_HlUMTvFmYxi9H06JU_daE0Z2fGe-9q-GwiTFPzGKbVg-Otip-npWW1qvWJehSl9NxHmto6l0"
      });
      console.log(token);  
  }
}