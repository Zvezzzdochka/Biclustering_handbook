from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import LessonViewSet, TestViewSet, ResultViewSet, ArticleViewSet, RegisterView, UserProfileView

# роутер
router = DefaultRouter()

# эндпоинты
router.register(r'articles', ArticleViewSet, basename='article')
router.register(r'lessons', LessonViewSet, basename='lesson')
router.register(r'tests', TestViewSet, basename='test')
router.register(r'results', ResultViewSet, basename='result')

urlpatterns = [

    path('', include(router.urls)),

    # Эндпоинты для JWT-авторизации (логин)
    path('auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # Эндпоинты для регистрации и профиля
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/profile/', UserProfileView.as_view(), name='profile'),
]