import React from 'react'
import { NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next';
import FlagEn from '../flags/Uk.png'
import FlagFr from '../flags/Fr.png'
import FlagTr from '../flags/Tr.png'
import styles from './Navbar.module.css';
import NavBrand from '../logo/LogoBlack.png'
import useLogout from '../hooks/useLogout';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';


export default function Navbar() {
    const { t, i18n } = useTranslation();
    const { accessToken } = useAuth()

    const logout = useLogout()
    const navigate = useNavigate();
    const changeLanguage = (language) => {
        i18n.changeLanguage(language);
    };

    const onLogout = async () => {
        await logout()
        navigate('/auth/login');
    }


    return (
        <nav className='navbar navbar-expand-lg navbar-dark bg-dark'>
            <div className="container-fluid">
                <NavLink className={'nav-link'} to={(localStorage.getItem('accessToken') && localStorage.getItem('csrfToken')) ? '/auth/enhanceddashboard' : '/auth/login'}><img src={NavBrand} id={styles.navImage} className='img-fluid my-2' /></NavLink>

                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className='navbar-nav me-auto mb-2 mb-lg-0' id={styles.menuFrame}>


                        {accessToken ? <>
                            <li className='nav-item'><NavLink className={'nav-link'} to={'/auth/enhanceddashboard'}><b className='fs-4'>{t('navEnhancedDashboard')}</b></NavLink></li>
                            <li className='nav-item'><NavLink className={'nav-link'} to={'/auth/update'}><b className='fs-4'>{t('update')}</b></NavLink></li>
                            <li className='nav-item'><a className='nav-link' id={styles.logoutButton} onClick={() => onLogout()}><b className='fs-4'>{t('logout')}</b></a></li>
                        </> : <>
                            <li className='nav-item'><NavLink className={'nav-link'} to={'/auth/login'}><b className='fs-4'>{t('navLogin')}</b></NavLink></li>
                            <li className='nav-item'><NavLink className={'nav-link'} to={'/auth/register'}><b className='fs-4'>{t('navRegister')}</b></NavLink></li>

                        </>}



                        <li className="dropdown nav-item" id={styles.flagFrame}>
                            <NavLink className="nav-link dropdown-toggle fs-4" href="#" id="languageDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                <b>{t('language')}</b>
                            </NavLink>
                            <ul className="dropdown-menu" aria-labelledby="languageDropdown">
                                <li>
                                    <a className="dropdown-item" onClick={() => changeLanguage('tr')}>
                                        <img src={FlagTr} className="me-2" id={styles.flag} alt="Turkish" /> {t('turkish')}
                                    </a>
                                </li>
                                <li>
                                    <a className="dropdown-item" onClick={() => changeLanguage('en')}>
                                        <img src={FlagEn} className="me-2" id={styles.flag} alt="English" /> {t('english')}
                                    </a>
                                </li>
                                <li>
                                    <a className="dropdown-item" onClick={() => changeLanguage('fr')}>
                                        <img src={FlagFr} className="me-2" id={styles.flag} alt="French" /> {t('french')}
                                    </a>
                                </li>
                            </ul>
                        </li>
                       

                        
                    </ul>
                </div>
            </div>

        </nav>
    )
}
