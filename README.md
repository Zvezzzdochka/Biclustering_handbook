# Biclustering_handbook
Выпускная квалификационная работа по теме "Разработка электронного пособия по методам бикластеризации", Вагин Иван Николаевич, ПГНИУ, ИКНТ

Технологический стек
- Backend: Python, Django, Django REST Framework, APScheduler
- Frontend: JavaScript, React.js
- База данных: PostgreSQL
- Аутентификация: JWT (JSON Web Tokens)

Предварительные требования
Убедитесь, что на вашем компьютере установлены:
- Python (версия 3.10 или выше)
- Node.js и npm (версия 16.x или выше)
- PostgreSQL (версия 12 или выше)
- Git

Запуск проекта

1. Откройте терминал (или командную строку) и клонируйте проект на свой локальный компьютер:
git clone https://github.com/Zvezzzdochka/Biclustering_handbook.git
cd Biclustering_handbook

2. Настройка базы данных PostgreSQL
Перед запуском сервера необходимо создать локальную базу данных.
Откройте консоль PostgreSQL (psql) или используйте pgAdmin и выполните следующие SQL-команды:
CREATE DATABASE biclustering_db;
CREATE USER db_user WITH PASSWORD 'your_password';
ALTER ROLE db_user SET client_encoding TO 'utf8';
ALTER ROLE db_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE db_user SET timezone TO 'UTC';
GRANT ALL PRIVILEGES ON DATABASE biclustering_db TO db_user;

3. Настройка серверной части
Перейдите в папку проекта:
- Создайте и активируйте виртуальное окружение:
python -m venv venv
venv\Scripts\activate

- Установите зависимости:
pip install -r requirements.txt

- Настройте переменные окружения:
Создайте файл .env в корневой директории проекта (рядом с файлом settings.py или manage.py) и добавьте в него настройки вашей БД:
SECRET_KEY=your_django_secret_key
DEBUG=True
DB_NAME=biclustering_db
DB_USER=db_user
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432

- Примените миграции базы данных:
python manage.py migrate

- Загрузите начальные данные (уроки, тесты, вопросы):
В корне проекта подготовлен файл script_loading_data.sql с готовым образовательным контентом.
Загрузите его в базу данных через терминал с помощью утилиты psql:

psql -U db_user -d biclustering_db -f script_loading_data.sql

Либо просто откройте файл script_loading_data.sql в вашем менеджере баз данных, например в pgAdmin или DBeaver,
подключитесь к базе biclustering_db и нажмите кнопку выполнения скрипта

- Создайте суперпользователя (администратора):
python manage.py createsuperuser

- Запустите сервер разработки:
python manage.py runserver
API бэкенда будет доступно по адресу: http://127.0.0.1:8000/

4. Настройка клиентской части
Откройте новое окно терминала и перейдите в папку frontend:
cd frontend

- Установите npm-зависимости:
npm install

- Настройте подключение к API:
Убедитесь, что в файле конфигурации или .env внутри фронтенда указан правильный URL вашего бэкенда.
.env во фронтенде:
REACT_APP_API_URL=http://127.0.0.1:8000/api/

- Запустите React-приложение:
npm start

Сайт откроется в браузере по адресу: http://localhost:3000/

5. Работа с поисковым ботом-загрузчиком научных статей
В проект встроен автономный бот-парсер, работающий на базе APScheduler. В конфигурации по умолчанию он запускается автоматически каждую неделю в фоновом режиме вместе с процессом Django.

Если вы хотите принудительно запустить сбор статей для тестирования прямо сейчас:

Откройте файл, где инициализируется планировщик scheduler.py

Раскомментируйте внизу файла строки для тестового запуска (помечены комментариями).

Перезапустите сервер Django (python manage.py runserver). Бот обратится к API arXiv, Europe PMC и Crossref, спарсит свежие публикации по бикластеризации и сохранит их в таблицу Article.


Использование системы
Перейдите на http://localhost:3000/.

В разделе «Учебник» вам уже будут доступны уроки и тесты.

Зарегистрируйте нового пользователя для прохождения тестов и сохранения прогресса в Личном кабинете, или войдите под созданным суперпользователем.

Добавлять/редактировать уроки и тесты также можно через панель администратора: http://127.0.0.1:8000/admin/.