import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ArticlesPage = () => {
    const [articles, setArticles] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrder, setSortOrder] = useState('newest');

    // Состояние для пагинации
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 7;

    useEffect(() => {
        axios.get('http://127.0.0.1:8000/api/articles/')
            .then(response => setArticles(response.data))
            .catch(error => console.error("Ошибка загрузки статей:", error));
    }, []);

    // Функция для форматирования списка авторов
    const formatAuthors = (authorsString) => {
        if (!authorsString) return 'Не указаны';

        // Разделяем авторов по запятой и убираем лишние пробелы по краям
        const authorsArray = authorsString.split(',').map(author => author.trim());

        if (authorsArray.length <= 3) {
            return authorsArray.join(', ');
        }

        // Берём первые 3 автора и добавляем
        return `${authorsArray.slice(0, 3).join(', ')} и др.`;
    };

    // При изменении поиска или сортировки сбрасываем страницу на первую
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const handleSortChange = (e) => {
        setSortOrder(e.target.value);
        setCurrentPage(1);
    };

    // 1. Фильтрация
    let result = articles.filter(article =>
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.authors.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // 2. Сортировка
    result.sort((a, b) => {
        const dateA = a.publication_date ? new Date(a.publication_date) : new Date(0);
        const dateB = b.publication_date ? new Date(b.publication_date) : new Date(0);
        return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });

    // 3. Логика пагинации
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = result.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(result.length / itemsPerPage);

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div style={styles.pageWrapper}>
            <div style={styles.container}>
                <h1 style={styles.title}>Научные публикации</h1>

                <div style={styles.controls}>
                    <input
                        type="text"
                        placeholder="Поиск по названию или автору..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        style={styles.searchInput}
                    />
                    <select
                        value={sortOrder}
                        onChange={handleSortChange}
                        style={styles.select}
                    >
                        <option value="newest">Сначала новые</option>
                        <option value="oldest">Сначала старые</option>
                    </select>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {currentItems.length > 0 ? (
                        currentItems.map(article => (
                            <div key={article.id} style={styles.articleCard}>
                                <h2 style={styles.articleTitle}>{article.title}</h2>
                                <p style={styles.metaData}>
                                    <strong>Дата публикации:</strong> {article.publication_date ? article.publication_date : 'Не указана'} |
                                    {/* Применили функцию форматирования авторов */}
                                    <strong> Авторы:</strong> {formatAuthors(article.authors)}
                                </p>
                                <p style={styles.abstract}>{article.abstract}</p>
                                <a href={article.url} target="_blank" rel="noopener noreferrer" style={styles.link}>
                                    Перейти к статье &rarr;
                                </a>
                            </div>
                        ))
                    ) : (
                        <p style={styles.notFound}>Статей по вашему запросу не найдено.</p>
                    )}
                </div>

                {totalPages > 1 && (
                    <div style={styles.pagination}>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNumber => (
                            <button
                                key={pageNumber}
                                onClick={() => paginate(pageNumber)}
                                style={{
                                    ...styles.pageButton,
                                    ...(currentPage === pageNumber ? styles.activePageButton : {})
                                }}
                            >
                                {pageNumber}
                            </button>
                        ))}
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
    controls: {
        display: 'flex',
        gap: '15px',
        marginBottom: '30px'
    },
    searchInput: {
        flex: 1,
        padding: '12px 15px',
        fontSize: '16px',
        borderRadius: '4px',
        border: '1px solid #ccd1d9',
        fontFamily: 'inherit'
    },
    select: {
        padding: '12px 15px',
        fontSize: '16px',
        borderRadius: '4px',
        border: '1px solid #ccd1d9',
        fontFamily: 'inherit',
        backgroundColor: '#fff',
        cursor: 'pointer'
    },
    articleCard: {
        borderLeft: '4px solid #2c3e50',
        backgroundColor: '#fff',
        padding: '25px',
        borderRadius: '4px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.05)'
    },
    articleTitle: {
        margin: '0 0 10px 0',
        fontSize: '22px',
        color: '#2c3e50'
    },
    metaData: {
        color: '#7f8c8d',
        fontSize: '15px',
        margin: '0 0 15px 0'
    },
    abstract: {
        fontSize: '16px',
        color: '#333',
        lineHeight: '1.6'
    },
    link: {
        display: 'inline-block',
        marginTop: '15px',
        color: '#2c3e50',
        fontWeight: 'bold',
        textDecoration: 'none',
        fontSize: '16px'
    },
    notFound: {
        fontSize: '18px',
        color: '#7f8c8d'
    },
    pagination: {
        display: 'flex',
        justifyContent: 'center',
        gap: '10px',
        marginTop: '40px'
    },
    pageButton: {
        padding: '10px 18px',
        backgroundColor: '#fff',
        color: '#2c3e50',
        border: '1px solid #ccd1d9',
        borderRadius: '4px',
        fontSize: '16px',
        fontWeight: 'bold',
        cursor: 'pointer',
        fontFamily: 'inherit',
        transition: 'all 0.2s'
    },
    activePageButton: {
        backgroundColor: '#2c3e50',
        color: 'white',
        border: '1px solid #2c3e50'
    }
};

export default ArticlesPage;