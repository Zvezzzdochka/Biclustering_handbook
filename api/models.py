from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):

    # Расширенная модель пользователя системы.

    ROLE_CHOICES = (
        ('student', 'Студент'),
        ('admin', 'Администратор'),
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='student')
    full_name = models.CharField(max_length=255)

    def __str__(self):
        return f"{self.full_name} ({self.username})"


class Lesson(models.Model):

    # Модель для хранения теоретических материалов по бикластеризации.

    title = models.CharField(max_length=255)
    content = models.TextField()
    order_num = models.IntegerField(unique=True)

    class Meta:
        ordering = ['order_num']

    def __str__(self):
        return self.title


class Test(models.Model):

    # Модель проверочного испытания, привязанного к уроку.

    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE, related_name='tests')
    title = models.CharField(max_length=255)

    def __str__(self):
        return f"Тест: {self.title}"


class Question(models.Model):

    # Модель вопроса. Поле options JSONB для хранения структуры ответов.

    test = models.ForeignKey(Test, on_delete=models.CASCADE, related_name='questions')
    text = models.TextField()
    correct_answer = models.CharField(max_length=255)
    options = models.JSONField() 

    def __str__(self):
        return self.text[:50]


class Result(models.Model):

    # Модель фиксации результатов тестирования.

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='results')
    test = models.ForeignKey(Test, on_delete=models.CASCADE, related_name='results')
    score = models.IntegerField()
    passed_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.test.title} - {self.score}"


class Article(models.Model):

    # Таблица для хранения агрегированных ботом научных публикаций.

    title = models.CharField(max_length=500)
    authors = models.CharField(max_length=500)
    abstract = models.TextField(null=True, blank=True)
    publication_date = models.DateField(null=True, blank=True)
    url = models.URLField(unique=True)
    added_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title