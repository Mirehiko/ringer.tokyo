# Generated by Django 2.1.7 on 2019-06-02 06:31

from django.db import migrations, models
import works.models


class Migration(migrations.Migration):

    dependencies = [
        ('works', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='workimages',
            name='url',
            field=models.ImageField(blank=True, max_length=255, null=True, upload_to=works.models.content_file_name_related, verbose_name='Изображение'),
        ),
    ]
