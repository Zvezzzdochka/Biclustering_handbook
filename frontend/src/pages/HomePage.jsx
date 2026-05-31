import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
    return (
        <div style={styles.pageWrapper}>
            <div style={styles.container}>
                {/* Отдельная строка по центру */}
                <h2 style={styles.welcome}>Добро пожаловать!</h2>

                {/* Основной контент, выровненный по левому краю */}
                <div style={styles.content}>
                    <p style={styles.paragraph}>
                        Этот справочник поможет вам детально разобраться в алгоритмах бикластеризации.
                        В отличие от классических методов, бикластеризация находит скрытые локальные закономерности в данных,
                        выполняя одновременную группировку строк и столбцов матриц.
                    </p>

                    <h3 style={styles.subTitle}>Чему вы научитесь:</h3>
                    <ul style={styles.list}>
                        <li style={styles.listItem}>
                            <strong>Понимать теорию:</strong> от базовых математических концепций до сложных современных алгоритмов.
                        </li>
                        <li style={styles.listItem}>
                            <strong>Применять на практике:</strong> анализировать данные в биоинформатике, текстовом анализе и рекомендательных системах.
                        </li>
                        <li style={styles.listItem}>
                            <strong>Закреплять материал:</strong> проходить интерактивные тесты после каждого урока для проверки знаний.
                        </li>
                    </ul>

                    <p style={styles.paragraph}>
                        Обучение построено по принципу «от простого к сложному», что позволит вам последовательно освоить тему и сразу отслеживать свой прогресс.
                    </p>
                </div>

                <div style={{ marginTop: '50px', textAlign: 'center' }}>
                    <Link to="/lessons" style={styles.startButton}>
                        Начать учиться
                    </Link>
                </div>
            </div>
        </div>
    );
};

const styles = {
    pageWrapper: {
        minHeight: '100vh',
        backgroundColor: '#f4f6f9',
        padding: '40px 0 60px 0',
        fontFamily: '"PF Square Sans Pro", sans-serif'
    },
    container: {
        maxWidth: '1000px',
        margin: '0 auto',
        padding: '0 20px',
    },
    welcome: {
        fontSize: '36px',
        color: '#2c3e50',
        textAlign: 'center',
        marginTop: '10px',
        marginBottom: '25px',
        fontWeight: 'bold'
    },
    content: {
        fontSize: '18px',
        lineHeight: '1.7',
        color: '#333',
        textAlign: 'left'
    },
    paragraph: {
        marginBottom: '20px'
    },
    subTitle: {
        fontSize: '26px',
        color: '#2c3e50',
        marginTop: '35px',
        marginBottom: '15px'
    },
    list: {
        listStyleType: 'none',
        padding: 0,
        margin: '0 0 30px 0'
    },
    listItem: {
        marginBottom: '15px'
    },
    startButton: {
        display: 'inline-block',
        padding: '14px 35px',
        backgroundColor: '#2c3e50',
        color: 'white',
        textDecoration: 'none',
        borderRadius: '4px',
        fontSize: '20px',
        fontWeight: 'bold',
        transition: 'opacity 0.2s'
    }
};

export default HomePage;