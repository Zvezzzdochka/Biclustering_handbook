import requests
from requests.utils import quote
from bs4 import BeautifulSoup
from datetime import datetime
from .models import Article

# Вспомогательная функция для очистки текста от HTML-тегов
def clean_html(raw_text):
    if not raw_text:
        return ""
    return BeautifulSoup(raw_text, "html.parser").text.strip().replace('\n', ' ')

# Парсинг статей из репозитория arXiv (XML)
def fetch_arxiv(query):
    encoded_query = quote(query)
    url = f"http://export.arxiv.org/api/query?search_query=all:\"{encoded_query}\"&sortBy=submittedDate&sortOrder=descending&max_results=5"

    try:
        response = requests.get(url, timeout=10)
        if response.status_code == 200:
            soup = BeautifulSoup(response.content, 'xml')
            entries = soup.find_all('entry')

            for entry in entries:
                link = entry.id.text.strip()
                if Article.objects.filter(url=link).exists():
                    continue

                title = entry.title.text.strip().replace('\n', ' ')
                abstract = clean_html(entry.summary.text)
                authors_list = [author.find('name').text for author in entry.find_all('author')]
                authors_str = ", ".join(authors_list)

                pub_date_raw = entry.published.text.strip()
                pub_date = datetime.strptime(pub_date_raw[:10], '%Y-%m-%d').date()

                Article.objects.create(
                    title=title, authors=authors_str, abstract=abstract,
                    publication_date=pub_date, url=link
                )
                print(f"Добавлена статья (arXiv): {title}")
    except Exception as e:
        print(f"Ошибка arXiv по запросу '{query}': {e}")


# Парсинг статей из базы Europe PMC (JSON)
def fetch_europe_pmc(query):
    encoded_query = quote(query)
    url = f"https://www.ebi.ac.uk/europepmc/webservices/rest/search?query={encoded_query}&format=json&resultType=core&pageSize=5"

    try:
        response = requests.get(url, timeout=10)
        if response.status_code == 200:
            data = response.json()
            results = data.get('resultList', {}).get('result', [])

            for item in results:
                # Формируем ссылку на основе PMID или DOI
                if item.get('pmid'):
                    link = f"https://europepmc.org/article/MED/{item.get('pmid')}"
                elif item.get('doi'):
                    link = f"https://doi.org/{item.get('doi')}"
                else:
                    continue

                if Article.objects.filter(url=link).exists():
                    continue

                title = item.get('title', '')
                abstract = clean_html(item.get('abstractText', ''))
                authors_str = item.get('authorString', '')

                pub_date_raw = item.get('firstPublicationDate', '')
                try:
                    pub_date = datetime.strptime(pub_date_raw, '%Y-%m-%d').date()
                except ValueError:
                    pub_date = datetime.now().date()

                if title:
                    Article.objects.create(
                        title=title, authors=authors_str, abstract=abstract,
                        publication_date=pub_date, url=link
                    )
                    print(f"Добавлена статья (Europe PMC): {title}")
    except Exception as e:
        print(f"Ошибка Europe PMC по запросу '{query}': {e}")


# Парсинг статей из базы Crossref (JSON)
def fetch_crossref(query):
    encoded_query = quote(query)
    # Запрашиваем только нужные поля
    url = f"https://api.crossref.org/works?query={encoded_query}&select=title,abstract,author,created,URL&rows=5&sort=created&order=desc"

    try:
        response = requests.get(url, timeout=10)
        if response.status_code == 200:
            data = response.json()
            items = data.get('message', {}).get('items', [])

            for item in items:
                link = item.get('URL', '')
                if not link or Article.objects.filter(url=link).exists():
                    continue

                title_list = item.get('title', [])
                title = title_list[0] if title_list else ''
                abstract = clean_html(item.get('abstract', ''))

                # Собираем авторов
                authors_list = []
                for author in item.get('author', []):
                    family = author.get('family', '')
                    given = author.get('given', '')
                    if family or given:
                        authors_list.append(f"{given} {family}".strip())
                authors_str = ", ".join(authors_list)

                # Извлекаем дату
                date_parts = item.get('created', {}).get('date-parts', [[None]])[0]
                if date_parts and len(date_parts) >= 3:
                    pub_date = datetime(date_parts[0], date_parts[1], date_parts[2]).date()
                else:
                    pub_date = datetime.now().date()

                if title:
                    Article.objects.create(
                        title=title, authors=authors_str, abstract=abstract,
                        publication_date=pub_date, url=link
                    )
                    print(f"Добавлена статья (Crossref): {title}")
    except Exception as e:
        print(f"Ошибка Crossref по запросу '{query}': {e}")

# Функция запуска поиска статей
def fetch_biclustering_articles():
    search_queries = [
        "biclustering",
        "Cheng and Church",
        "Formal Concept Analysis"
    ]

    print("Бот запущен: идет поиск новых статей")

    for query in search_queries:
        fetch_arxiv(query)
        fetch_europe_pmc(query)
        fetch_crossref(query)

    print("Поиск завершен.")