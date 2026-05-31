import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const LessonsPage = () => {
    const [lessons, setLessons] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('http://127.0.0.1:8000/api/lessons/')
            .then(response => {
                setLessons(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Ошибка загрузки уроков:", error);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <div style={styles.pageWrapper}>
                <div style={styles.container}>
                    <h2 style={styles.title}>Загрузка учебника...</h2>
                </div>
            </div>
        );
    }

    // Разбиваем массив уроков на три логических блока
    const topics = [
        {
            title: "Введение в кластерный анализ",
            data: lessons.slice(0, 3),
            startIndex: 0
        },
        {
            title: "Алгоритмы бикластеризации",
            data: lessons.slice(3, 6),
            startIndex: 0
        },
        {
            title: "Формальный анализ понятий",
            data: lessons.slice(6, 9),
            startIndex: 0
        }
    ];

    return (
        <div style={styles.pageWrapper}>
            <div style={styles.container}>
                <h1 style={styles.title}>Учебник с уроками</h1>

                {/* Проходимся по каждой теме и отрисовываем её блок */}
                {topics.map((topic, topicIndex) => (
                    // Рендерим блок только если в нем есть уроки
                    topic.data.length > 0 && (
                        <div key={topicIndex} style={styles.sectionWrapper}>
                            <h2 style={styles.sectionTitle}>{topic.title}</h2>

                            <div style={styles.grid}>
                                {topic.data.map((lesson, index) => (
                                    <div key={lesson.id} style={styles.card}>
                                        <div style={styles.cardHeader}>
                                            Урок {topic.startIndex + index + 1}
                                        </div>
                                        <h3 style={styles.cardTitle}>{lesson.title}</h3>

                                        <p style={styles.preview}>
                                            {/* Добавлена защита, если контент пустой */}
                                            {lesson.content ? lesson.content.substring(0, 120) : ''}...
                                        </p>

                                        <Link to={`/lessons/${lesson.id}`} style={styles.button}>
                                            Перейти к уроку
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )
                ))}
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
        marginBottom: '40px',
        fontWeight: 'bold'
    },
    sectionWrapper: {
        marginBottom: '50px'
    },
    sectionTitle: {
        fontSize: '24px',
        color: '#2c3e50',
        borderBottom: '2px solid #eef2f5',
        paddingBottom: '10px',
        marginBottom: '20px'
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '25px'
    },
    card: {
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#fff',
        borderRadius: '4px',
        padding: '25px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
        borderTop: '4px solid #2c3e50'
    },
    cardHeader: {
        color: '#7f8c8d',
        fontSize: '14px',
        marginBottom: '10px',
        textTransform: 'uppercase',
        letterSpacing: '1px',
        fontWeight: 'bold'
    },
    cardTitle: {
        fontSize: '20px',
        color: '#2c3e50',
        marginTop: '0',
        marginBottom: '15px'
    },
    preview: {
        color: '#444',
        fontSize: '15px',
        lineHeight: '1.5',
        flexGrow: 1,
        marginBottom: '25px'
    },
    button: {
        textAlign: 'center',
        padding: '12px 16px',
        backgroundColor: '#2c3e50',
        color: '#fff',
        textDecoration: 'none',
        borderRadius: '4px',
        fontWeight: 'bold',
        fontSize: '15px',
        transition: 'background-color 0.2s'
    }
};

export default LessonsPage;