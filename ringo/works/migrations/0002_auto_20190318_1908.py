# Generated by Django 2.1.7 on 2019-03-18 14:08

import django.core.files.storage
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('works', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='work',
            name='poster',
            field=models.ImageField(default='default.jpg', upload_to=django.core.files.storage.FileSystemStorage(location='/media/works'), verbose_name='Постер'),
        ),
        migrations.AlterField(
            model_name='category',
            name='category',
            field=models.CharField(default='', max_length=200, verbose_name='Категория'),
        ),
        migrations.AlterField(
            model_name='news',
            name='description',
            field=models.CharField(default='', max_length=500, verbose_name='Описание'),
        ),
        migrations.AlterField(
            model_name='news',
            name='title',
            field=models.CharField(default='', max_length=200, verbose_name='Заголовок'),
        ),
        migrations.AlterField(
            model_name='user',
            name='name',
            field=models.CharField(default='', max_length=200, verbose_name='Компания'),
        ),
        migrations.AlterField(
            model_name='work',
            name='category',
            field=models.ManyToManyField(blank=True, to='works.Category', verbose_name='Категория'),
        ),
        migrations.AlterField(
            model_name='work',
            name='description',
            field=models.CharField(default='', max_length=500, verbose_name='Описание'),
        ),
        migrations.AlterField(
            model_name='work',
            name='launch_date',
            field=models.DateTimeField(verbose_name='Дата запуска'),
        ),
        migrations.AlterField(
            model_name='work',
            name='title',
            field=models.CharField(default='', max_length=200, verbose_name='Название'),
        ),
        migrations.AlterField(
            model_name='work',
            name='user',
            field=models.ManyToManyField(blank=True, to='works.User', verbose_name='Компания'),
        ),
    ]
