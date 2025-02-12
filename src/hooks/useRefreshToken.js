import { axiosInstance } from "../axios";
import useAuth from "./useAuth";

export default function useRefreshToken() {
    const { setAccessToken, setCSRFToken } = useAuth()

    const refresh = async () => {
        const response = await axiosInstance.post('auth/refresh-token')
        setAccessToken(response.data.access ? response.data.access : localStorage.getItem("accessToken"))
        setCSRFToken(response.headers["x-csrftoken"] ? response.headers["x-csrftoken"] : localStorage.getItem("csrfToken"))

        return { accessToken: response.data.access, csrfToken: response.headers["x-csrftoken"] }
    }

    return refresh
}