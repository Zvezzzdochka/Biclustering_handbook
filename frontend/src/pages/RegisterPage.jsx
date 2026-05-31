import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const RegisterPage = () => {
    const [formData, setFormData] = useState({ username: '', password: '', email: '', full_name: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://127.0.0.1:8000/api/auth/register/', formData);
            alert('Регистрация прошла успешно! Теперь вы можете войти.');
            navigate('/login');
        } catch (err) {
            setError('Ошибка при регистрации. Возможно, логин уже занят.');
        }
    };

    return (
        <div style={styles.pageWrapper}>
            <div style={styles.formCard}>
                <h2 style={styles.title}>Регистрация</h2>
                {error && <p style={styles.error}>{error}</p>}

                <form onSubmit={handleRegister} style={styles.form}>
                    <input name="username" type="text" placeholder="Придумайте логин" onChange={handleChange} required style={styles.input} />
                    <input name="password" type="password" placeholder="Придумайте пароль" onChange={handleChange} required style={styles.input} />
                    <input name="email" type="email" placeholder="Ваш Email" onChange={handleChange} style={styles.input} />
                    <input name="full_name" type="text" placeholder="ФИО" onChange={handleChange} style={styles.input} />

                    <button type="submit" style={styles.button}>Зарегистрироваться</button>
                </form>
                <p style={styles.bottomText}>
                    Уже есть аккаунт? <Link to="/login" style={styles.link}>Войти</Link>
                </p>
            </div>
        </div>
    );
};

const styles = {
    pageWrapper: {
        display: 'flex',
        justifyContent: 'center',
        paddingTop: '60px',
        paddingBottom: '60px',
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

export default RegisterPage;