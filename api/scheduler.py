import os
from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.cron import CronTrigger
from django.conf import settings
from django.utils import timezone
from .scraper import fetch_biclustering_articles
from datetime import timedelta

# Защита от двойного запуска
def start_bot():
    if os.environ.get('RUN_MAIN') != 'true':
        return

    # Явное указание часового пояса из настроек проекта
    scheduler = BackgroundScheduler(timezone=settings.TIME_ZONE)

    # Задача: запускать каждую неделю в воскресенье в 00:00
    scheduler.add_job(
        fetch_biclustering_articles,
        trigger=CronTrigger(day_of_week='sun', hour=0, minute=0),
        id='biclustering_bot_job',
        max_instances=1,
        replace_existing=True,
    )

    # ДЛЯ ТЕСТИРОВАНИЯ раскомментить
    # Использовать timezone.now() вместо datetime.now() для избежания конфликтов
    run_time = timezone.now() + timedelta(seconds=5)
    scheduler.add_job(fetch_biclustering_articles, 'date', run_date=run_time)

    scheduler.start()