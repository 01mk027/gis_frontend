import React from 'react';
import styles from './Footer.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook } from '@fortawesome/free-brands-svg-icons';
import { faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { faTwitter } from '@fortawesome/free-brands-svg-icons';
import { faYoutube } from '@fortawesome/free-brands-svg-icons';
import { faInstagram } from '@fortawesome/free-brands-svg-icons';
import { useTranslation } from 'react-i18next';


const Footer = () => {
    const { t, i18n } = useTranslation();

    return (
        <footer className="bg-dark text-white pt-4 pb-2">
            <div className="container text-center text-md-left">
                <div className="row">
                    {/* Social Media Section */}
                    <div className="col-md-6 col-lg-6 mx-auto mb-6">
                        <h5 className="text-uppercase font-weight-bold">{t('followUs')}</h5>
                        <ul className="list-unstyled d-flex justify-content-center my-3">
                            <li className="mx-2">
                                <a href="https://www.facebook.com/reklamerhan/" target="_blank" className="text-white">
                                <FontAwesomeIcon icon={faFacebook} size="2x" style={{ color: '#4267B2', backgroundColor:'white', borderRadius: '50%', width:'25px', height:'25px' }} />  
                                </a>
                            </li>
                            <li className="mx-2">
                                <a href="https://www.linkedin.com/company/15084588" target="_blank" className="text-white">
                                <FontAwesomeIcon icon={faLinkedin} size="2x" style={{ color: '#4267B2', backgroundColor: 'white', width:'25px', height:'25px' }} />  
                                </a>
                            </li>
                            <li className="mx-2">
                                <a href="https://twitter.com/erhanreklam" target="_blank" className="text-white">
                                <FontAwesomeIcon icon={faTwitter} size="2x" style={{ color: 'white', width:'25px', height:'25px' }} />  
                                </a>
                            </li>

                            <li className="mx-2">
                                <a href="https://www.youtube.com/@erhanreklam315" target="_blank" className="text-white">
                                <FontAwesomeIcon icon={faYoutube} size="2x" style={{ color: 'red', width:'25px', height:'25px' }} />  
                                </a>
                            </li>
                            <li className="mx-2">
                                <a href="https://www.instagram.com/erhanreklam/" target="_blank" className="text-white">
                                <FontAwesomeIcon icon={faInstagram} size="2x" id={styles.instagramLogo} />  
                                </a>
                            </li>
                            
                            
                        </ul>
                    </div>

                    {/* Contact Section */}
                    <div className="col-md-6 col-lg-6 mx-auto mb-6">
                        <h5 className="text-uppercase font-weight-bold">{t('contact')}</h5>
                        <p>
                            <i className="fas fa-home mr-2"></i> Erhan Reklam ve Matbaacılık
                            Tanıtım Hizmetleri San.Tic.Ltd.Şti
                            Topçular Mahallesi, Talimhane Caddesi
                            Hacı Eşref Sokak No:8
                            Topçular / 34055
                            Eyüp / İstanbul / Türkiye
                        </p>
                        <p>
                            <i className="fas fa-envelope mr-2"></i> <a href='mailto:info@www.erhanreklam.com'  style={{ color: 'white', listStyle: 'none' }}>info@www.erhanreklam.com</a>
                        </p>
                        <p>
                            <i className="fas fa-phone mr-2"></i> <a href="tel:+902125327487" style={{ color: 'white', listStyle: 'none' }}>+90 212 532 74 87</a>
                        </p>
                    </div>
                </div>

                <hr className="my-3" />

                {/* Copyright Section */}
                <div className="row d-flex justify-content-center">
                    <div className="col-md-6 text-center">
                        <a target="_blank" style={{ color: 'white', listStyle: 'none' }} href="https://www.erhanreklam.com"><p>© {new Date().getFullYear()} Erhan Reklam</p></a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
