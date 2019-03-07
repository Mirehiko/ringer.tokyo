import datetime

from datetime import datetime
from django.db import models
from django.utils import timezone



class Category(models.Model):
    category = models.CharField(max_length=200, default='')

    def __str__(self):
        return self.category


class User(models.Model):
    # work = models.ForeignKey(Work, on_delete=models.CASCADE)
    name = models.CharField(max_length=200, default='')

    def __str__(self):
        return self.name


class Work(models.Model):
    title = models.CharField(max_length=200, default='')
    description = models.CharField(max_length=500, default='')
    pub_date = models.DateTimeField(auto_now_add=True)
    # category = models.ForeignKey(Category, on_delete=models.CASCADE)
    launch_date = models.DateTimeField('Launch date')

    user = models.ManyToManyField(User)
    category = models.ManyToManyField(Category)

    def __str__(self):
        return self.title

    def was_published_recently(self):
        return self.pub_date >= timezone.now() - datetime.timedelta(days=1)


class News(models.Model):
    title = models.CharField(max_length=200, default='')
    description = models.CharField(max_length=500, default='')
    pub_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

    def was_published_recently(self):
        return self.pub_date >= timezone.now() - datetime.timedelta(days=1)
