import React, { useContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import useAuth from '../../hooks/useAuth';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { axiosInstance } from '../../axios'
import { useNavigate } from 'react-router-dom';
import useLogout from "../../hooks/useLogout"
import styles from './Update.module.css';



const Update = () => {
    const { t } = useTranslation();
    const { user, setUser } = useAuth();
    const axiosPrivateInstance = useAxiosPrivate();
    const navigate = useNavigate();
    const [username, setUsername] = useState(user && user.username ? user.username : '');
    const [email, setEmail] = useState(user && user.email ? user.email : '');
    const [password, setPassword] = useState('');
    const [confirmedPassword, setConfirmedPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showError, setShowError] = useState("");
    const logout = useLogout()


    useEffect(() => {
        async function getUser() {
            try {
                const { data } = await axiosPrivateInstance.get('auth/user');
                setUser(data);
                setUsername(data.username); // Update the username state with fetched data
                setEmail(data.email)
            } catch (err) {
                console.error('Error fetching user data:', err);
            }
        }

        getUser()
    }, []);


    const triggerError = () => {
        setShowError(t('updateError'));

        // Clear the error after 5 seconds
        setTimeout(() => {
            setShowError("");
        }, 5000);
    };



    const onSubmitForm = async (e) => {
        e.preventDefault();
        if (password !== confirmedPassword) {
            alert(t('confirmPasswordWarning'));
            return;
        }
        await axiosInstance.post('auth/update', JSON.stringify({
            username: username,
            email: email,
            password: password,
        })).then(async (res) => {
            setEmail()
            setPassword()
            setUsername()
            setConfirmedPassword()
            setLoading(false)
            await logout()
            navigate('/auth/login')
        }).catch(err => {
            triggerError();
        });
    };

    return (
        <div className="d-flex justify-content-center bg-dark" id={styles.updateMainFrame}>
            <div className="w-100" style={{ maxWidth: '600px' }}>

            {showError && (
                <div className="alert alert-danger my-2 rounded">{showError}</div>
            )}
            <div className='jumbotron-fluid text-light' id={styles.warning}>
                <b>{t('updateWarning')}</b>
            </div>
            <form onSubmit={onSubmitForm}>
                <div className="mb-3">
                    <input
                        type="text"
                        placeholder={t('username')}
                        autoComplete="off"
                        className="form-control"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)} // Update username as user types
                        required
                    />
                </div>
                <div className="mb-3">
                    <input
                        type="email"
                        placeholder={t('email')}
                        autoComplete="off"
                        className="form-control"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <input
                        type="password"
                        placeholder={t('password')}
                        autoComplete="off"
                        className="form-control"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <input type="password" placeholder={t('confirmPassword')} autoComplete='off' className='form-control' id="passwordConfirmation" onChange={(e) => setConfirmedPassword(e.target.value)} />
                </div>
                <div className="mb-3 text-center">
                    <button disabled={loading} className="btn" type="submit" id={styles.submitButton}>
                        {t('update')}
                    </button>
                </div>
            </form>
        </div>
        </div>
    );
};

export default Update;
