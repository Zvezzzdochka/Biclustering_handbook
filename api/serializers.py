from rest_framework import serializers
from .models import Lesson, Test, Question, Result, Article, User

class ArticleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Article
        fields = ['id', 'title', 'authors', 'abstract', 'url', 'publication_date']


class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        # Передаем все поля, включая варианты ответов options
        fields = ['id', 'text', 'options', 'correct_answer']


class TestSerializer(serializers.ModelSerializer):
    # Вкладываем вопросы внутрь теста.
    questions = QuestionSerializer(many=True, read_only=True)

    class Meta:
        model = Test
        fields = ['id', 'title', 'lesson', 'questions']


class LessonSerializer(serializers.ModelSerializer):
    # Вкладываем тесты внутрь урока
    tests = TestSerializer(many=True, read_only=True)

    class Meta:
        model = Lesson
        fields = ['id', 'title', 'content', 'order_num', 'tests']


class ResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = Result
        fields = ['id', 'user', 'test', 'score', 'passed_at']
        read_only_fields = ['user']

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'password', 'email', 'full_name']

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password'],
            full_name=validated_data.get('full_name', '')
        )
        return user


class UserProfileSerializer(serializers.ModelSerializer):
    # Привязываем историю тестов к профилю пользователя
    results = ResultSerializer(many=True, read_only=True)

    role = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'full_name', 'role', 'results']

    def get_role(self, obj):
        # Если это суперпользователь Django отдаем роль admin
        if obj.is_superuser:
            return 'admin'
        # В противном случае отдаем то, что записано в его поле role в БД
        return obj.role


class ResultSerializer(serializers.ModelSerializer):
    # Вытягиваем названия из связанных таблиц (Test и Lesson)
    test_title = serializers.CharField(source='test.title', read_only=True)
    lesson_title = serializers.CharField(source='test.lesson.title', read_only=True)

    # Динамически вычисляем максимальный балл
    max_score = serializers.SerializerMethodField()

    class Meta:
        model = Result
        fields = ['id', 'test', 'test_title', 'lesson_title', 'score', 'max_score', 'passed_at']

    def get_max_score(self, obj):
        # Если в модели Test нет отдельного поля max_score,
        # логично считать максимальным баллом количество вопросов в тесте.
        # obj.test.questions.count() вернет количество связанных вопросов.
        return obj.test.questions.count()


class UserProfileSerializer(serializers.ModelSerializer):
    # Вкладываем результаты пользователя.
    # Замени 'result_set' на related_name из модели Result (внешний ключ на User),
    # если ты указывал его явно. Если не указывал, по умолчанию Django использует имя_модели_set.
    results = ResultSerializer(many=True, read_only=True)

    class Meta:
        model = User
        # Укажи здесь поля, которые есть в твоей модели User и которые ждет фронтенд
        fields = ['id', 'username', 'email', 'full_name', 'role', 'results']