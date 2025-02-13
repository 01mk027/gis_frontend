import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { axiosInstance } from '../../axios';
import useAuth from '../../hooks/useAuth';
import { useTranslation } from 'react-i18next';
import styles from './Login.module.css';

export default function Login() {
  const { t } = useTranslation();
  const { setAccessToken, setCSRFToken } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const fromLocation = location?.state?.from?.pathname || '/auth/enhanceddashboard';
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [showError, setShowError] = useState('');

  const triggerError = () => {
    setShowError(t('loginError'));
    setTimeout(() => {
      setShowError('');
    }, 5000);
  };

  function onEmailChange(event) {
    setEmail(event.target.value);
  }

  function onPasswordChange(event) {
    setPassword(event.target.value);
  }

  async function onSubmitForm(event) {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await axiosInstance.post(
        'auth/login',
        JSON.stringify({ email, password })
      );
      setAccessToken(response?.data?.access_token);
      setCSRFToken(response.headers['x-csrftoken']);
      localStorage.setItem('accessToken', response?.data?.access_token);
      localStorage.setItem('csrfToken', response.headers['x-csrftoken']);
      setEmail('');
      setPassword('');
      setLoading(false);
      navigate(fromLocation, { replace: true });
    } catch (error) {
      console.log(error);
      setLoading(false);
      triggerError();
    }
  }

  return (
    <div className={`d-flex justify-content-center align-items-center bg-dark`} id={styles.loginMainFrame}>
      <div className='w-100' style={{ maxWidth: '400px' }}>
        {showError && (
          <div className='alert alert-danger my-2 rounded'>{showError}</div>
        )}
        <form onSubmit={onSubmitForm} className='p-2'>
          <div className='mb-3'>
            <input
              type='email'
              placeholder={t('email')}
              autoComplete='off'
              className='form-control'
              id='email'
              onChange={onEmailChange}
              required
            />
          </div>
          <div className='mb-3'>
            <input
              type='password'
              placeholder={t('password')}
              autoComplete='off'
              className='form-control'
              id='password'
              onChange={onPasswordChange}
              required  
            />
          </div>
          <div className='mb-3'>
            <button disabled={loading} className='btn w-100' type='submit' id={styles.submitButton}>
              {t('login')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
