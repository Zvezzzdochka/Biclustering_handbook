from django.contrib import admin
from .models import User, Lesson, Test, Question, Result, Article

admin.site.register(User)
admin.site.register(Lesson)
admin.site.register(Test)
admin.site.register(Question)
admin.site.register(Result)
admin.site.register(Article)