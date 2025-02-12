import { useContext, useDebugValue } from "react";
import AuthContext from "../store/auth-context"

export default function useAuth() {
    const { auth } = useContext(AuthContext)

    useDebugValue(auth, auth => auth?.user && (localStorage.getItem("accessToken") && localStorage.getItem("csrfToken"))? "Logged In" : "Logged Out")

    return useContext(AuthContext)
}