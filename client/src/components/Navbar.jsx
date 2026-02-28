import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();

    // Theme state
    const [isDarkMode, setIsDarkMode] = useState(() => {
        return localStorage.getItem('theme') === 'dark';
    });

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
        }
    }, [isDarkMode]);

    const toggleTheme = () => {
        setIsDarkMode(prevMode => !prevMode);
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const changeLanguage = () => {
        const newLang = i18n.language.startsWith('vi') ? 'en' : 'vi';
        i18n.changeLanguage(newLang);
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-logo">
                    Cứu Trợ 24h
                </Link>
                <div className="navbar-links">
                    <Link to="/" className="nav-link">{t('navbar.home')}</Link>
                    <Link to="/news" className="nav-link">{t('navbar.news')}</Link>
                    <Link to="/statement" className="nav-link">{t('navbar.statement')}</Link>
                    <Link to="/donate" className="nav-link">{t('navbar.donate')}</Link>
                    <Link to="/map" className="nav-link">{t('navbar.map')}</Link>
                    <Link to="/volunteer" className="nav-link" style={{ color: "var(--primary-color)" }}>
                        {t('navbar.volunteer')}
                    </Link>

                    {/* Language Switcher */}
                    <button
                        onClick={changeLanguage}
                        className="btn btn-sm btn-outline"
                        style={{ border: 'none', background: 'transparent', boxShadow: 'none', padding: '0.5rem', fontSize: '1.2rem', cursor: 'pointer' }}
                        title="Change Language"
                    >
                        {i18n.language.startsWith('vi') ? '🇻🇳' : '🇺🇸'}
                    </button>

                    {/* Theme Toggle Button */}
                    <button
                        onClick={toggleTheme}
                        className="btn btn-sm btn-outline"
                        style={{ border: 'none', background: 'transparent', boxShadow: 'none', padding: '0.5rem', fontSize: '1.2rem' }}
                        title="Đổi giao diện Sáng/Tối"
                    >
                        {isDarkMode ? '🌞' : '🌙'}
                    </button>

                    {user ? (
                        <>
                            {user.role === 'admin' && (
                                <Link to="/admin" className="nav-link admin-link">{t('navbar.admin')}</Link>
                            )}
                            <Link to="/profile" className="nav-link" title="Xem Hồ Sơ & Lịch Sử Quyên Góp">
                                {t('navbar.hello')}, {user.username}
                            </Link>
                            <button onClick={handleLogout} className="btn btn-sm btn-outline">{t('navbar.logout')}</button>
                        </>
                    ) : (
                        <Link to="/login" className="btn btn-sm btn-outline">{t('navbar.login')}</Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
