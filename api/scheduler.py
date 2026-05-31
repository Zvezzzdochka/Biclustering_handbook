from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.cron import CronTrigger
from .scraper import fetch_biclustering_articles
from datetime import datetime, timedelta

def start_bot():
    scheduler = BackgroundScheduler()

    # Добавили задачу: запускать каждую неделю (в воскресенье в 00:00)
    scheduler.add_job(
        fetch_biclustering_articles,
        trigger=CronTrigger(day_of_week='sun', hour=0, minute=0),
        id='biclustering_bot_job',
        max_instances=1,
        replace_existing=True,
    )

    # ДЛЯ ТЕСТИРОВАНИЯ раскомментить
    # scheduler.add_job(fetch_biclustering_articles, 'date', run_date=datetime.now() + timedelta(seconds=5))

    scheduler.start()