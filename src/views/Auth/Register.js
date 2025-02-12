import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { axiosInstance } from '../../axios';
import { useTranslation } from 'react-i18next';
import styles from './Register.module.css';

export default function Register() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [showError, setShowError] = useState('');

  function onEmailChange(event) {
    setEmail(event.target.value);
  }

  function onPasswordChange(event) {
    setPassword(event.target.value);
  }

  function onUsernameChange(event) {
    setUsername(event.target.value);
  }

  function onPasswordConfirmationChange(event) {
    setPasswordConfirmation(event.target.value);
  }

  async function onSubmitForm(event) {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await axiosInstance.post(
        'auth/register',
        JSON.stringify({
          username,
          email,
          password,
          password2: passwordConfirmation,
        })
      );

      setEmail('');
      setPassword('');
      setUsername('');
      setPasswordConfirmation('');
      setLoading(false);
      navigate('/auth/login');
    } catch (error) {
      setLoading(false);
      triggerError();
    }
  }

  const triggerError = () => {
    setShowError(t('registerError'));
    setTimeout(() => {
      setShowError('');
    }, 5000);
  };

  return (
    <div className="d-flex justify-content-center bg-dark" id={styles.registerMainFrame}>
      <div className="w-100" style={{ maxWidth: '600px' }}>
        {showError && (
          <div className="alert alert-danger my-2 rounded">{showError}</div>
        )}
        <div className='jumbotron-fluid text-light' id={styles.warning}>
            <b>{t('registerWarning')}</b>
        </div>
        <form onSubmit={onSubmitForm}>
          <div className="mb-3">
            <input
              type="text"
              placeholder={t('username')}
              autoComplete="off"
              className="form-control"
              id="username"
              onChange={onUsernameChange}
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
              onChange={onEmailChange}
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
              onChange={onPasswordChange}
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="password"
              placeholder={t('confirmPassword')}
              autoComplete="off"
              className="form-control"
              id="passwordConfirmation"
              onChange={onPasswordConfirmationChange}
              required
            />
          </div>
          <div className="mb-3">
            <button disabled={loading} className="btn w-100" type="submit" id={styles.submitButton}>
              {t('register')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
