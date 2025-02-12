import React, {useEffect} from 'react'
import useAuth from '../hooks/useAuth'
import { useNavigate } from 'react-router-dom'


export default function Home() {
    const navigate = useNavigate();
    const { accessToken, user, setUser } = useAuth()


    useEffect(() => {
        if(accessToken){
            navigate('/auth/enhanceddashboard');
        }
    }, [])

    return (
        <div className='jumbotron bg-light'>Home</div>
    )
}
