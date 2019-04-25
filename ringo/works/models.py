import datetime

from datetime import datetime
from django.db import models
from django.utils import timezone



class Category(models.Model):
    category = models.CharField(max_length=200, verbose_name='Категория', blank=False)
    category_url = models.CharField(max_length=200, verbose_name='Ссылка на категорию', blank=False)

    def __str__(self):
        return self.category


class User(models.Model):
    # work = models.ForeignKey(Work, on_delete=models.CASCADE)
    name = models.CharField(max_length=200, default='', verbose_name='Компания')

    def __str__(self):
        return self.name


class Work(models.Model):
    title = models.CharField(max_length=200, default='', verbose_name='Название')
    description = models.TextField(max_length=500, default='', verbose_name='Описание', blank=True)
    pub_date = models.DateTimeField(auto_now_add=True)
    # category = models.ForeignKey(Category, on_delete=models.CASCADE)
    launch_date = models.DateTimeField(verbose_name='Дата запуска')
    poster = models.ImageField(null=True, upload_to='works', default='default.jpg', verbose_name='Постер', max_length=255, blank=True)

    user = models.ManyToManyField(User, verbose_name='Компания', blank=True)
    category = models.ManyToManyField(Category, verbose_name='Категория', blank=True)

    def __str__(self):
        return self.title

    def was_published_recently(self):
        return self.pub_date >= timezone.now() - datetime.timedelta(days=1)

    # def getCategoryList(self):
    #     if self.category.all().count() > 0:
    #         # print(self.category.all())
    #         return self.category.all()
    #     else:
    #         return ''

    def getPoster(self):
        if not self.image:
            return 'Image not found'

    def poster_image(self, obj):
        return mark_safe('<img src="{url}" width="{width}" height={height} />'.format(
            url = obj.headshot.url,
            width=obj.headshot.width,
            height=obj.headshot.height,
        )
    )


class WorkImages(models.Model):
    title = models.CharField(max_length=200, default='', verbose_name='Заголовок')
    url = models.ImageField(null=True, upload_to='works', default='default.jpg', verbose_name='Изображение', max_length=255, blank=True)
    work = models.ForeignKey(Work, on_delete=models.CASCADE, blank=True, default='')

    def __str__(self):
        return self.title

    def preview_image(self, obj):
        return mark_safe('<img src="{url}" width="{width}" height={height} />'.format(
            url = obj.headshot.url,
            width=obj.headshot.width,
            height=obj.headshot.height,
        )
    )


class WorkVideo(models.Model):
    title = models.CharField(max_length=200, default='', verbose_name='Название')
    url = models.TextField(max_length=1500, default='', verbose_name='Ссылка на видеофайл', blank=True)
    work = models.ForeignKey(Work, on_delete=models.CASCADE, blank=True, default='')

    is_html = models.BooleanField(verbose_name='HTML-код', default=False, blank=True)
    # is_url = models.BooleanField(verbose_name='Ссылка', default=False, blank=True)
    # is_upload = 
    
    def __str__(self):
        return self.title


class NewsStatus(models.Model):
    name = models.CharField(max_length=200, default='', verbose_name='Название')

    def __str__(self):
        return self.name


class News(models.Model):
    title = models.CharField(max_length=200, default='', verbose_name='Заголовок')
    description = models.TextField(max_length=500, default='', verbose_name='Описание', blank=True)
    # status = models.ForeignKey(NewsStatus, on_delete=models.CASCADE, blank=True, default='')
    pub_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

    def was_published_recently(self):
        return self.pub_date >= timezone.now() - datetime.timedelta(days=1)
