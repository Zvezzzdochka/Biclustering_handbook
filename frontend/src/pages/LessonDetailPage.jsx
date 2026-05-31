import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';

const LessonDetailPage = () => {
    const { id } = useParams();
    const [lesson, setLesson] = useState(null);

    useEffect(() => {
        axios.get(`http://127.0.0.1:8000/api/lessons/${id}/`)
            .then(response => setLesson(response.data))
            .catch(error => console.error("Ошибка загрузки урока:", error));
    }, [id]);

    if (!lesson) {
        return (
            <div style={styles.pageWrapper}>
                <div style={styles.container}>
                    <h2 style={styles.title}>Загрузка урока...</h2>
                </div>
            </div>
        );
    }

    return (
        <div style={styles.pageWrapper}>
            <div style={styles.container}>
                <Link to="/lessons" style={styles.backLink}>&larr; Вернуться к списку тем</Link>

                {/* Основной блок с текстом урока */}
                <div style={styles.contentCard}>
                    <h1 style={styles.lessonTitle}>{lesson.title}</h1>
                    <div style={styles.lessonContent}>
                        {lesson.content}
                    </div>
                </div>

                {/* Блок с призывом пройти тест */}
                {lesson.tests && lesson.tests.length > 0 ? (
                    <div style={styles.testSection}>
                        <h3 style={styles.testTitle}>Урок пройден? Время проверить знания.</h3>
                        {/* Берем ID первого теста из массива tests */}
                        <Link to={`/tests/${lesson.tests[0].id}`} style={styles.testButton}>
                            Пройти тест по уроку
                        </Link>
                    </div>
                ) : (
                    <div style={styles.testSection}>
                        <h3 style={styles.testTitle}>Для этого урока тест еще не добавлен.</h3>
                    </div>
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
        maxWidth: '850px',
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
    backLink: {
        display: 'inline-block',
        color: '#7f8c8d',
        textDecoration: 'none',
        fontSize: '16px',
        marginBottom: '20px',
        fontWeight: 'bold'
    },
    contentCard: {
        backgroundColor: '#fff',
        padding: '40px',
        borderRadius: '4px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
        marginBottom: '30px'
    },
    lessonTitle: {
        marginTop: '0',
        fontSize: '32px',
        color: '#2c3e50',
        borderBottom: '2px solid #eef2f5',
        paddingBottom: '20px',
        marginBottom: '30px'
    },
    lessonContent: {
        fontSize: '18px',
        color: '#333',
        lineHeight: '1.8',
        whiteSpace: 'pre-wrap'
    },
    testSection: {
        backgroundColor: '#fff',
        padding: '30px',
        borderRadius: '4px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
        textAlign: 'center',
        borderLeft: '4px solid #2c3e50'
    },
    testTitle: {
        fontSize: '20px',
        color: '#2c3e50',
        marginTop: '0',
        marginBottom: '20px',
        fontWeight: 'bold'
    },
    testButton: {
        display: 'inline-block',
        padding: '12px 30px',
        backgroundColor: '#2c3e50',
        color: '#fff',
        textDecoration: 'none',
        borderRadius: '4px',
        fontWeight: 'bold',
        fontSize: '16px',
        transition: 'background-color 0.2s'
    }
};

export default LessonDetailPage;