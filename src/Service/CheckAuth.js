import { setLoggedIn, setLoggedOut } from "../Feature/Redux/Auth/AuthSlice";
import { checkJwt } from "./Api";

export const checkLoginStatus = async (dispatch) => {
  try {
    const response = await checkJwt();
    console.log(response);

    if (response.success && response.data) {
      dispatch(
        setLoggedIn({
          isLoggedIn: true,
        })
      );
    }

    return response;
  } catch (error) {
    console.error("Error checking login status:", error);
    throw error;
  }
};
