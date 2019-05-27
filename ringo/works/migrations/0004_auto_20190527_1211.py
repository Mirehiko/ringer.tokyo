# Generated by Django 2.1.7 on 2019-05-27 07:11

from django.db import migrations, models
import works.models


class Migration(migrations.Migration):

    dependencies = [
        ('works', '0003_auto_20190527_1110'),
    ]

    operations = [
        migrations.AddField(
            model_name='workvideo',
            name='video',
            field=models.FileField(blank=True, max_length=255, null=True, upload_to=works.models.content_file_name_related_video, verbose_name='Видеофайл'),
        ),

        migrations.AlterField(
            model_name='workvideo',
            name='preview',
            field=models.ImageField(blank=True, max_length=255, null=True, upload_to=works.models.content_file_name_related, verbose_name='Превью'),
        ),
    ]
