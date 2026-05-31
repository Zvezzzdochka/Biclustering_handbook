import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const DashboardPage = () => {
    const [profile, setProfile] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('access_token');

        if (!token) {
            navigate('/login');
            return;
        }

        axios.get('http://127.0.0.1:8000/api/auth/profile/', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            setProfile(response.data);
        })
        .catch(error => {
            console.error("Ошибка проверки токена:", error);
            localStorage.removeItem('access_token');
            navigate('/login');
        });
    }, [navigate]);

    if (!profile) {
        return (
            <div style={styles.pageWrapper}>
                <div style={styles.container}>
                    <h2 style={styles.title}>Загрузка профиля...</h2>
                </div>
            </div>
        );
    }

    return (
        <div style={styles.pageWrapper}>
            <div style={styles.container}>
                <h1 style={styles.title}>Личный кабинет</h1>

                {/* Карточка профиля студента */}
                <div style={styles.infoCard}>
                    <p style={styles.cardText}><strong>ФИО:</strong> {profile.full_name || profile.username}</p>
                    <p style={styles.cardText}><strong>Email:</strong> {profile.email || 'Не указан'}</p>
                    <p style={styles.cardText}>
                        <strong>Статус:</strong> {
                            profile.is_superuser || profile.role === 'admin'
                                ? 'Администратор'
                                : profile.role === 'teacher'
                                    ? 'Преподаватель'
                                    : 'Обучающийся'
                        }
                    </p>
                </div>

                <h2 style={styles.subTitle}>История тестирования</h2>
                {profile.results && profile.results.length > 0 ? (
                    <div style={styles.tableWrapper}>
                        <table style={styles.table}>
                            <thead>
                                <tr style={styles.tableHeaderRow}>
                                    <th style={styles.th}>Урок</th>
                                    <th style={styles.th}>Тест</th>
                                    <th style={styles.th}>Баллы</th>
                                    <th style={styles.th}>Дата прохождения</th>
                                </tr>
                            </thead>
                            <tbody>
                                {profile.results.map(res => (
                                    <tr key={res.id} style={styles.tableRow}>
                                        <td style={styles.td}>{res.lesson_title || 'Общий раздел'}</td>
                                        <td style={styles.td} style={{ ...styles.td, fontWeight: 'bold', color: '#2c3e50' }}>
                                            {res.test_title || `Тест #${res.test}`}
                                        </td>
                                        <td style={styles.td}>
                                            {/* Убрать пробелы вокруг слэша */}
                                            <span style={styles.scoreBadge}>
                                                {res.score}/{res.max_score || 10}
                                            </span>
                                        </td>
                                        <td style={styles.td}>{new Date(res.passed_at).toLocaleString('ru-RU')}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p style={styles.noResults}>Вы еще не прошли ни одного теста.</p>
                )}
            </div>
        </div>
    );
};

const styles = {
    pageWrapper: {
        minHeight: '100vh',
        backgroundColor: '#f4f6f9',
        padding: '20px 0 60px 0',
        fontFamily: '"PF Square Sans Pro", sans-serif'
    },
    container: {
        maxWidth: '1000px',
        margin: '0 auto',
        padding: '0 20px',
        textAlign: 'left'
    },
    title: {
        fontSize: '32px',
        color: '#2c3e50',
        marginBottom: '30px',
        fontWeight: 'bold'
    },
    subTitle: {
        fontSize: '24px',
        color: '#2c3e50',
        marginTop: '40px',
        marginBottom: '20px',
        fontWeight: 'bold'
    },
    infoCard: {
        padding: '25px',
        backgroundColor: '#fff',
        borderRadius: '4px',
        borderLeft: '4px solid #2c3e50',
        boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
    },
    cardText: {
        margin: 0,
        fontSize: '16px',
        color: '#333'
    },
    tableWrapper: {
        backgroundColor: '#fff',
        borderRadius: '4px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
        overflow: 'hidden',
        marginTop: '15px'
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
        fontSize: '16px'
    },
    tableHeaderRow: {
        backgroundColor: '#2c3e50',
    },
    th: {
        color: '#fff',
        padding: '14px 18px',
        textAlign: 'left',
        fontWeight: 'bold',
        fontSize: '15px'
    },
    tableRow: {
        borderBottom: '1px solid #eef2f5',
        transition: 'background-color 0.2s'
    },
    td: {
        padding: '14px 18px',
        color: '#444',
        verticalAlign: 'middle'
    },
    scoreBadge: {
        backgroundColor: '#eef2f5',
        padding: '4px 10px',
        borderRadius: '4px',
        fontWeight: 'bold',
        color: '#2c3e50',
        display: 'inline-block',
        whiteSpace: 'nowrap'
    },
    noResults: {
        fontSize: '16px',
        color: '#7f8c8d',
        marginTop: '15px'
    }
};

export default DashboardPage;