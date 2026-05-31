import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/auth/login/', {
                username,
                password
            });

            localStorage.setItem('access_token', response.data.access);
            localStorage.setItem('refresh_token', response.data.refresh);

            navigate('/dashboard');
            window.location.reload();
        } catch (err) {
            setError('Неверный логин или пароль. Попробуйте снова.');
        }
    };

    return (
        <div style={styles.pageWrapper}>
            <div style={styles.formCard}>
                <h2 style={styles.title}>Вход в систему</h2>
                {error && <p style={styles.error}>{error}</p>}

                <form onSubmit={handleLogin} style={styles.form}>
                    <input
                        type="text"
                        placeholder="Логин"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        style={styles.input}
                    />
                    <input
                        type="password"
                        placeholder="Пароль"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={styles.input}
                    />
                    <button type="submit" style={styles.button}>Войти</button>
                </form>
                <p style={styles.bottomText}>
                    Нет аккаунта? <Link to="/register" style={styles.link}>Зарегистрируйтесь</Link>
                </p>
            </div>
        </div>
    );
};

const styles = {
    pageWrapper: {
        display: 'flex',
        justifyContent: 'center',
        paddingTop: '80px',
        fontFamily: '"PF Square Sans Pro", sans-serif'
    },
    formCard: {
        padding: '40px',
        borderRadius: '8px',
        width: '350px',
        backgroundColor: '#fff',
        boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
        border: 'none'
    },
    title: {
        color: '#2c3e50',
        textAlign: 'center',
        marginBottom: '25px',
        marginTop: 0
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
    },
    input: {
        padding: '12px',
        fontSize: '16px',
        borderRadius: '4px',
        border: '1px solid #ccd1d9',
        fontFamily: 'inherit'
    },
    button: {
        padding: '14px',
        backgroundColor: '#2c3e50',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        fontSize: '18px',
        cursor: 'pointer',
        fontWeight: 'bold',
        marginTop: '10px',
        fontFamily: 'inherit'
    },
    error: {
        color: '#e74c3c',
        textAlign: 'center',
        marginBottom: '15px',
        fontSize: '14px'
    },
    bottomText: {
        marginTop: '25px',
        textAlign: 'center',
        color: '#555',
        fontSize: '16px'
    },
    link: {
        color: '#2c3e50',
        fontWeight: 'bold',
        textDecoration: 'none'
    }
};

export default LoginPage;