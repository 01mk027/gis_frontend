import useAuth from "../hooks/useAuth"
import { Navigate, Outlet, useLocation } from "react-router-dom"

export default function AuthMiddleware() {
    const { accessToken, user } = useAuth()
    const location = useLocation()

    return (accessToken && user ? <Outlet /> : <Navigate to="/auth/login" state={{ from: location }} replace />)
}