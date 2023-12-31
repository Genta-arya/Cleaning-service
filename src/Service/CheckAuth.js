import { useSelector } from "react-redux";
import { selectIsRole, setLoggedIn, setRole } from "../Feature/Redux/Auth/AuthSlice";
import { checkJwt } from "./Api";

export const checkLoginStatus = async (dispatch) => {
  try {
    const response = await checkJwt();

    if (response.success && response.data && response.role) {
      dispatch(setLoggedIn({ isLoggedIn: true }));
      dispatch(setRole(response.role)); 
    }

    return response;
  } catch (error) {
    console.error("Error checking login status:", error);
    throw error;
  }
};
