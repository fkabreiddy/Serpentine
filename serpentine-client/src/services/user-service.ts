import api from "@/config/axios-config";
import ApiResult from "@/models/api-result";
import LoginUserRequest from "@/models/requests/user/login-user-request";


const loginUserAsync = async (user: LoginUserRequest) => {
  try {
    const response = await api.post<ApiResult<JWTResponse>>(`/user/authenticate`, user, {
        headers: {
            "Content-Type": "application/json",
        },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
}