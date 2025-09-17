import axios from "axios";
import { getCookie } from "cookies-next";

const axiosClient = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_MYROOM_API_URI}${process.env.NEXT_PUBLIC_ORGANIZATION_SERVICE_URL}`,

  headers: {
    "Content-Type": "application/json",
  },
});

export const setAuthTokenForOrganizationService = () => {
  try {
    const userDataCookie = getCookie("userData");
    
    if (!userDataCookie || typeof userDataCookie !== 'string') {
      console.warn("userData cookie not found or invalid");
      return;
    }
    
    const userData = JSON.parse(userDataCookie);
    
    if (!userData?.stsTokenManager?.accessToken) {
      console.warn("Invalid userData structure or missing access token");
      return;
    }
    
    const accessToken = userData.stsTokenManager.accessToken;
    axiosClient.defaults.headers["Authorization"] = "Bearer " + accessToken;
  } catch (error) {
    console.error("Error parsing userData cookie:", error);
  }
};

export default axiosClient;
