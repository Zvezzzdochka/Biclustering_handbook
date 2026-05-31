import requests
from requests.utils import quote
from bs4 import BeautifulSoup
from datetime import datetime
from .models import Article


def fetch_biclustering_articles():

    # 1. список ключевых слов
    search_queries = [
        "biclustering",
        "Cheng and Church",
        "Formal Concept Analysis",
        "бикластеризация",
        "формальный анализ понятий"
    ]

    print("Бот запущен: идет поиск новых статей")

    for query in search_queries:
        # Формируем URL. Ищем по ключевым словам.
        encoded_query = quote(query)
        url = f"http://export.arxiv.org/api/query?search_query=all:\"{encoded_query}\"&sortBy=submittedDate&sortOrder=descending&max_results=5"

        try:
            response = requests.get(url, timeout=10)
            if response.status_code == 200:
                soup = BeautifulSoup(response.content, 'xml')
                entries = soup.find_all('entry')

                for entry in entries:
                    link = entry.id.text.strip()

                    # Проверка на дубликаты
                    if Article.objects.filter(url=link).exists():
                        continue

                    # Извлекаем данные
                    title = entry.title.text.strip().replace('\n', ' ')
                    abstract = entry.summary.text.strip().replace('\n', ' ')

                    # Собираем всех авторов в одну строку
                    authors_list = [author.find('name').text for author in entry.find_all('author')]
                    authors_str = ", ".join(authors_list)

                    # Извлекаем дату публикации
                    pub_date_raw = entry.published.text.strip()
                    pub_date = datetime.strptime(pub_date_raw[:10], '%Y-%m-%d').date()

                    # Сохраняем в БД.
                    Article.objects.create(
                        title=title,
                        authors=authors_str,
                        abstract=abstract,
                        publication_date=pub_date,
                        url=link
                    )
                    print(f"Добавлена новая статья: {title}")

        except Exception as e:
            print(f"Ошибка при парсинге по запросу '{query}': {e}")

    print("Поиск завершен.")