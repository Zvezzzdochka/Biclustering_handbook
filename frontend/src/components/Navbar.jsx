import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    // Проверяем, есть ли токен в памяти
    const isAuthenticated = !!localStorage.getItem('access_token');

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        navigate('/');
        window.location.reload();
    };

    return (
        <nav style={styles.nav}>
            <div style={styles.logo}>
                {/* Обернули текст в ссылку, ведущую на главную страницу */}
                <Link to="/" style={{ textDecoration: 'none', color: 'white' }}>
                    <h2 style={{ margin: 0 }}>Справочник по бикластеризации</h2>
                </Link>
            </div>
            <ul style={styles.menu}>
                <li><Link to="/" style={styles.link}>Главная</Link></li>
                <li><Link to="/lessons" style={styles.link}>Учебник</Link></li>
                <li><Link to="/articles" style={styles.link}>Статьи</Link></li>

                {/* рендеринг: показываем разные кнопки */}
                {isAuthenticated ? (
                    <>
                        <li><Link to="/dashboard" style={styles.authLink}>Личный кабинет</Link></li>
                        <li><button onClick={handleLogout} style={styles.logoutBtn}>Выйти</button></li>
                    </>
                ) : (
                    <li><Link to="/login" style={styles.authLink}>Вход/Регистрация</Link></li>
                )}
            </ul>
        </nav>
    );
};

const styles = {

    nav: { display: 'flex', justifyContent: 'space-between', padding: '20px 40px', backgroundColor: '#2c3e50', color: 'white', alignItems: 'center' },
    logo: { fontWeight: 'bold' },
    menu: { listStyle: 'none', display: 'flex', gap: '20px', margin: 0, alignItems: 'center', padding: 0 },
    link: { color: 'white', textDecoration: 'none', fontSize: '18px' },


    authLink: { color: 'white', textDecoration: 'none', fontSize: '18px' },


    logoutBtn: {
        backgroundColor: 'transparent',
        color: 'white',
        border: 'none',
        padding: 0,
        cursor: 'pointer',
        fontSize: '18px',
        fontFamily: 'inherit'
    }
};

export default Navbar;