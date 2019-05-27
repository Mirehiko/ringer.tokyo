import datetime
import os
from django.core.exceptions import ObjectDoesNotExist
from datetime import datetime
from django.db import models
from django.utils import timezone

def content_file_name(instance, filename):
    parts = filename.rsplit('.', 1)
    new_filename = '%s.%s' % ('poster', parts[1])
    return 'works/work_{0}/{1}'.format(instance.id, new_filename)

def content_file_name_related(instance, filename):
    parts = filename.rsplit('.', 1)
    new_filename = 'Work%sImage%s.%s' % (instance.work.id, instance.id, parts[1])
    return 'works/work_{0}/{1}'.format(instance.work.id, new_filename)

def content_file_name_related_video(instance, filename):
    parts = filename.rsplit('.', 1)
    new_filename = 'Work%sVideo%s.%s' % (instance.work.id, instance.id, parts[1])
    return 'works/work_{0}/{1}'.format(instance.work.id, new_filename)

def default_poster(instance, filename):
    print(filename,'============ file name =========')
    parts = filename.rsplit('.', 1)
    new_filename = 'default_poster'
    return 'default/%s.%s' % (new_filename, parts[1])

def default_preview(instance, filename):
    print(filename,'============ file name =========')
    parts = filename.rsplit('.', 1)
    new_filename = 'default_preview'
    return 'default/%s.%s' % (new_filename, parts[1])

def default_icon(instance, filename):
    print(filename,'============ file name =========')
    parts = filename.rsplit('.', 1)
    new_filename = 'icon'
    return 'default/%s.%s' % (new_filename, parts[1])


class Category(models.Model):
    category = models.CharField(max_length=200, default='', verbose_name='Категория', blank=False)
    category_url = models.CharField(max_length=200, default='', verbose_name='Ссылка на категорию', blank=False)

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
    poster = models.ImageField(null=True, upload_to=content_file_name, verbose_name='Постер', max_length=255, blank=True)

    user = models.ManyToManyField(User, verbose_name='Компания', blank=True)
    category = models.ManyToManyField(Category, verbose_name='Категория', blank=True)

    def __str__(self):
        return self.title

    def was_published_recently(self):
        return self.pub_date >= timezone.now() - datetime.timedelta(days=1)

    def get_absolute_url(self):
        return "/%i" % self.id

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

    def save(self, *args, **kwargs):
        try:
            this = Work.objects.get(id=self.id)
            try:
                if this.poster != self.poster:
                    this.poster.delete()
            except Exception as err:
                print('Poster save error')
                print(err)
        except Exception as err:
            print('Object does\'t exist')

        super(Work, self).save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        try:
            poster_file = Work.objects.get(pk=self.pk).poster
            if poster_file:
                if os.path.isfile(poster_file.path):
                    os.remove(poster_file.path)
        except ObjectDoesNotExist as err:
            print('Poster file does\'t exist')
            return False


        super(Work, self).delete(*args,**kwargs)


class WorkImages(models.Model):
    title = models.CharField(max_length=200, default='', verbose_name='Заголовок')
    url = models.ImageField(null=True, upload_to=content_file_name_related, default='default.jpg', verbose_name='Изображение', max_length=255, blank=True)
    link = models.CharField(max_length=500, default='', verbose_name='Внешняя ссылка', blank=True)
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

    def save(self, *args, **kwargs):
        try:
            this = WorkImages.objects.get(id=self.id)
            try:
                if this.url != self.url:
                    this.url.delete()
            except Exception as err:
                print('Image save error')
                print(err)
        except Exception as err:
            print('Object does\'t exist')

        super(WorkImages, self).save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        try:
            image_file = Work.objects.get(pk=self.pk).url
            if image_file:
                if os.path.isfile(image_file.path):
                    os.remove(image_file.path)
        except ObjectDoesNotExist as err:
            print('Image file does\'t exist')
            return False

        super(WorkImages, self).delete(*args,**kwargs)


class WorkVideo(models.Model):
    title = models.CharField(max_length=200, default='', verbose_name='Название')
    url = models.TextField(max_length=1500, default='', verbose_name='Ссылка на видеофайл', blank=True)
    preview = models.ImageField(null=True, upload_to=content_file_name_related, verbose_name='Превью', max_length=255, blank=True)
    video = models.FileField(null=True, upload_to=content_file_name_related_video, verbose_name='Видеофайл', max_length=255, blank=True)

    work = models.ForeignKey(Work, on_delete=models.CASCADE, blank=True, default='')

    is_html = models.BooleanField(verbose_name='HTML-код', default=False, blank=True)
    # is_url = models.BooleanField(verbose_name='Ссылка', default=False, blank=True)
    # is_upload =

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        try:
            this = WorkVideo.objects.get(id=self.id)
            try:
                if this.preview != self.preview:
                    this.preview.delete()
            except Exception as err:
                print('Image save error')
                print(err)

            try:
                if this.video and this.video != self.video:
                    this.video.delete()
                    # self.url = self.video.url
            except Exception as err:
                print('Video save error')
                print(err)
        except Exception as err:
            print('Object does\'t exist')

        super(WorkVideo, self).save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        try:
            preview_file = WorkVideo.objects.get(pk=self.pk).preview
            if preview_file:
                if os.path.isfile(preview_file.path):
                    os.remove(preview_file.path)
        except ObjectDoesNotExist as err:
            print('Preview file does\'t exist')
            return False

        try:
            video_file = WorkVideo.objects.get(pk=self.pk).video
            if video_file:
                if os.path.isfile(video_file.path):
                    os.remove(video_file.path)
        except ObjectDoesNotExist:
            print('Video file does\'t exist')
            return False

        super(WorkVideo, self).delete(*args,**kwargs)


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




class Default(models.Model):
    site_name = models.CharField(max_length=200, default='', verbose_name='Название сайта')
    site_icon = models.ImageField(upload_to=default_icon, verbose_name='Иконка сайта', max_length=255, blank=True)
    poster_default = models.ImageField(upload_to=default_poster, verbose_name='Изображение по умолчанию', max_length=255, blank=True)
    video_preview_default = models.ImageField(upload_to=default_preview, verbose_name='Превью видео по умолчанию', max_length=255, blank=True)
