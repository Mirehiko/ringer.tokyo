from django.contrib import admin

from .models import Work, News, Category, User

admin.site.register(Work)
admin.site.register(News)
admin.site.register(Category)
admin.site.register(User)
