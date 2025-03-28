import { useState, createContext } from 'react'


export const AuthContext = createContext({
    user: {},
    setUser: () => { },
    accessToken: null,
    refreshToken: null,
    csrftoken: null,
    setAccessToken: () => { },
    setRefreshToken: () => { },
    setCSRFToken: () => { }
})

export function AuthContextProvider(props) {

    const [user, setUser] = useState({})
    const [accessToken, setAccessToken] = useState(localStorage.getItem("accessToken") ? localStorage.getItem("accessToken") : null);
    const [refreshToken, setRefreshToken] = useState()
    const [csrftoken, setCSRFToken] = useState(localStorage.getItem("csrfToken") ? localStorage.getItem("csrfToken") : null)

    return <AuthContext.Provider value={{
        user, setUser,
        accessToken, setAccessToken,
        refreshToken, setRefreshToken,
        csrftoken, setCSRFToken
    }}>
        {props.children}
    </AuthContext.Provider>
}

export default AuthContext