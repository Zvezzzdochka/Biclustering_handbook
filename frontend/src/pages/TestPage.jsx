import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const TestPage = () => {
    const { testId } = useParams();
    const [testData, setTestData] = useState(null);
    const [answers, setAnswers] = useState({});
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [finalScore, setFinalScore] = useState(0);
    const [loading, setLoading] = useState(true);
    const [apiError, setApiError] = useState(null);

    const token = localStorage.getItem('access_token');
    const isAuthenticated = token && token !== 'null' && token !== 'undefined';

    useEffect(() => {
        if (!isAuthenticated) {
            setLoading(false);
            return;
        }

        axios.get(`http://127.0.0.1:8000/api/tests/${testId}/`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        .then(res => {
            setTestData(res.data);
            setLoading(false);
        })
        .catch(err => {
            setApiError(err.response?.data?.detail || "Ошибка загрузки теста.");
            setLoading(false);
        });
    }, [testId, token, isAuthenticated]);

    if (!isAuthenticated) {
        return (
            <div style={styles.pageWrapper}>
                <div style={styles.alertCard}>
                    <h2 style={styles.alertTitle}>Необходима авторизация</h2>
                    <p style={styles.alertText}>
                        Для прохождения тестирования необходимо войти в аккаунт.
                    </p>
                    <div style={styles.btnGroup}>
                        <Link to="/login" style={styles.loginBtn}>Войти</Link>
                        <Link to="/register" style={styles.registerBtn}>Регистрация</Link>
                    </div>
                </div>
            </div>
        );
    }

    if (loading) return <div style={{ textAlign: 'center', marginTop: '100px' }}>Загрузка теста...</div>;

    // Проверка: ответил ли пользователь на все вопросы
    const isAllAnswered = testData?.questions && Object.keys(answers).length === testData.questions.length;

    const handleSubmit = () => {
        let score = 0;
        testData.questions.forEach(q => {
            if (answers[q.id] === q.correct_answer) score += 1;
        });
        setFinalScore(score);
        setIsSubmitted(true);
        axios.post('http://127.0.0.1:8000/api/results/', { test: testId, score: score }, { headers: { 'Authorization': `Bearer ${token}` } });
    };

    return (
        <div style={styles.pageWrapper}>
            <div style={styles.container}>
                <h1 style={styles.title}>{testData?.title}</h1>

                {!isSubmitted ? (
                    <div>
                        {testData?.questions?.map((q, index) => (
                            <div key={q.id} style={styles.questionCard}>
                                <div style={styles.qHeader}>Вопрос {index + 1}</div>
                                <h3 style={styles.qText}>{q.text}</h3>
                                <div style={styles.optionsList}>
                                    {q.options.map((opt, i) => (
                                        <label key={i} style={styles.optionLabel}>
                                            <input
                                                type="radio"
                                                name={`q_${q.id}`}
                                                onChange={() => setAnswers(prev => ({...prev, [q.id]: opt}))}
                                                style={styles.radio}
                                            />
                                            {opt}
                                        </label>
                                    ))}
                                </div>
                            </div>
                        ))}

                        <button
                            onClick={handleSubmit}
                            style={isAllAnswered ? styles.submitBtn : { ...styles.submitBtn, ...styles.submitBtnDisabled }}
                            disabled={!isAllAnswered}
                        >
                            {isAllAnswered
                                ? 'Завершить тест'
                                : `Ответьте на все вопросы (${Object.keys(answers).length}/${testData?.questions?.length})`}
                        </button>
                    </div>
                ) : (
                    <div style={styles.resultCard}>
                        <h2 style={styles.resultTitle}>Тестирование завершено</h2>
                        <p style={styles.scoreText}>Вы набрали {finalScore} из {testData?.questions?.length} баллов.</p>
                        <Link to="/lessons" style={styles.backBtn}>Вернуться к списку уроков</Link>
                    </div>
                )}
            </div>
        </div>
    );
};

const styles = {
    pageWrapper: { minHeight: '100vh', backgroundColor: '#f4f6f9', padding: '80px 20px 40px 20px', fontFamily: '"PF Square Sans Pro", sans-serif' },
    container: { maxWidth: '800px', margin: '0 auto' },
    title: { color: '#2c3e50', marginBottom: '30px' },
    questionCard: { backgroundColor: '#fff', padding: '25px', borderRadius: '4px', marginBottom: '20px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' },
    qHeader: { color: '#7f8c8d', fontSize: '12px', textTransform: 'uppercase', marginBottom: '8px', fontWeight: 'bold' },
    qText: { marginTop: '0', marginBottom: '15px', color: '#2c3e50' },
    optionsList: { display: 'flex', flexDirection: 'column', gap: '12px' },
    optionLabel: { display: 'flex', alignItems: 'center', cursor: 'pointer', fontSize: '16px', color: '#34495e' },
    radio: { marginRight: '12px', transform: 'scale(1.2)' },

    submitBtn: {
        marginTop: '20px',
        padding: '15px 30px',
        backgroundColor: '#2c3e50',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        fontWeight: 'bold',
        cursor: 'pointer',
        fontSize: '16px',
        width: '100%',
        transition: 'background-color 0.2s'
    },
    submitBtnDisabled: {
        backgroundColor: '#bdc3c7',
        cursor: 'not-allowed'
    },

    resultCard: { textAlign: 'center', padding: '60px 40px', backgroundColor: '#fff', borderRadius: '4px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' },
    resultTitle: { color: '#2c3e50', marginTop: '0', marginBottom: '15px' },
    scoreText: { fontSize: '24px', fontWeight: 'bold', color: '#2c3e50', margin: '0' },

    backBtn: {
        display: 'inline-block',
        marginTop: '35px',
        padding: '12px 30px',
        backgroundColor: '#2c3e50',
        color: '#fff',
        textDecoration: 'none',
        borderRadius: '4px',
        fontWeight: 'bold',
        fontSize: '16px',
        transition: 'opacity 0.2s'
    },

    alertCard: {
        backgroundColor: '#fff',
        padding: '40px',
        borderRadius: '4px',
        maxWidth: '400px',
        margin: '0 auto',
        textAlign: 'center',
        boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
    },
    alertTitle: { color: '#2c3e50', marginTop: '0' },
    alertText: { color: '#7f8c8d', margin: '20px 0', lineHeight: '1.5' },
    btnGroup: {
        display: 'flex',
        gap: '12px',
        justifyContent: 'center',
        marginTop: '20px'
    },
    loginBtn: {
        padding: '12px 24px',
        backgroundColor: '#2c3e50',
        color: '#fff',
        textDecoration: 'none',
        borderRadius: '4px',
        fontWeight: 'bold',
        fontSize: '14px',
        flex: 1,
        textAlign: 'center'
    },
    registerBtn: {
        padding: '12px 24px',
        backgroundColor: '#2c3e50',
        color: '#fff',
        textDecoration: 'none',
        borderRadius: '4px',
        fontWeight: 'bold',
        fontSize: '14px',
        flex: 1,
        textAlign: 'center'
    }
};

export default TestPage;