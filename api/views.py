from rest_framework import viewsets, mixins
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from .serializers import RegisterSerializer, UserProfileSerializer
from rest_framework import generics
from .models import Lesson, Test, Question, Result, Article, User
from .serializers import (
    LessonSerializer, TestSerializer,
    QuestionSerializer, ResultSerializer, ArticleSerializer
)


class ArticleViewSet(viewsets.ReadOnlyModelViewSet):

    # Эндпоинт для получения списка научных статей.

    queryset = Article.objects.all().order_by('-added_at')
    serializer_class = ArticleSerializer
    permission_classes = [AllowAny]


class LessonViewSet(viewsets.ReadOnlyModelViewSet):

    # Эндпоинт для получения уроков.

    queryset = Lesson.objects.all()
    serializer_class = LessonSerializer
    permission_classes = [AllowAny]


class TestViewSet(viewsets.ReadOnlyModelViewSet):

    # Эндпоинт для получения тестов и связанных с ними вопросов.

    queryset = Test.objects.all()
    serializer_class = TestSerializer
    permission_classes = [AllowAny]


class ResultViewSet(mixins.CreateModelMixin,
                    mixins.ListModelMixin,
                    mixins.RetrieveModelMixin,
                    viewsets.GenericViewSet):

    # Эндпоинт для сохранения результатов тестирования и их просмотра.

    queryset = Result.objects.all().order_by('-passed_at')
    serializer_class = ResultSerializer

    # только авторизованные студенты могут сохранять результаты.
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        # Автоматически привязываем результат к пользователю из JWT-токена
        serializer.save(user=self.request.user)


class RegisterView(generics.CreateAPIView):
    # Эндпоинт для регистрации нового студента
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer


class UserProfileView(generics.RetrieveAPIView):
    # Эндпоинт для получения данных авторизованного пользователя (Личный кабинет)
    serializer_class = UserProfileSerializer
    permission_classes = (IsAuthenticated,)

    def get_object(self):
        # Возвращает пользователя, который прислал токен в запросе
        return self.request.user


from django.shortcuts import render

# Create your views here.
