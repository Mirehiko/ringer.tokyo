import datetime

from datetime import datetime
from django.db import models
from django.utils import timezone
from django.core.files.storage import FileSystemStorage

fs = FileSystemStorage(location='/media/works')

class Category(models.Model):
    category = models.CharField(max_length=200, default='', verbose_name='Категория')

    def __str__(self):
        return self.category


class User(models.Model):
    # work = models.ForeignKey(Work, on_delete=models.CASCADE)
    name = models.CharField(max_length=200, default='', verbose_name='Компания')

    def __str__(self):
        return self.name


class Work(models.Model):
    title = models.CharField(max_length=200, default='', verbose_name='Название')
    description = models.CharField(max_length=500, default='', verbose_name='Описание')
    pub_date = models.DateTimeField(auto_now_add=True)
    # category = models.ForeignKey(Category, on_delete=models.CASCADE)
    launch_date = models.DateTimeField(verbose_name='Дата запуска')
    poster = models.ImageField(upload_to=fs, default='default.jpg', verbose_name='Постер')

    user = models.ManyToManyField(User, verbose_name='Компания', blank=True)
    category = models.ManyToManyField(Category, verbose_name='Категория', blank=True)

    def __str__(self):
        return self.title

    def was_published_recently(self):
        return self.pub_date >= timezone.now() - datetime.timedelta(days=1)

    def getPoster(self):
        if not self.image:
            return 'Image not found'


class News(models.Model):
    title = models.CharField(max_length=200, default='', verbose_name='Заголовок')
    description = models.CharField(max_length=500, default='', verbose_name='Описание')
    pub_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

    def was_published_recently(self):
        return self.pub_date >= timezone.now() - datetime.timedelta(days=1)
