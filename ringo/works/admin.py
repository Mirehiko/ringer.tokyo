from django.contrib import admin

from .models import Work, WorkImages, News, Category, User

from multiupload.admin import MultiUploadAdmin
from django.urls import reverse
from django import forms
from inline_orderable.admin import OrderableStackedInline, OrderableTabularInline

class PosterInlineForm(forms.ModelForm):
    class Meta:
        model = WorkImages
        fields = ['title', 'url']


class PosterInlineWork(admin.TabularInline):
    model = WorkImages
    form = PosterInlineForm
    extra = 1


# class WorkForm(forms.ModelForm):
#     class Meta:
#         model = Work
#         fields = ['title', 'description', 'launch_date', 'poster', 'user', 'category']


# class PosterForm(forms.ModelForm):
#     def __init__(self, *args, **kwargs):
#         super(PosterForm, self).__init__(*args, **kwargs)
#         instance = getattr(self, 'instance', None)
#         self.fields['added_date'].initial = initial=timezone.now()
#         if self.instance.id:
#             self.fields['not_active_author'].initial = Author.objects.filter(active=False, photoalbum__id=self.instance.id)
#             self.fields['author_photo_not_active'].initial = [a.author for a in Author.ph_author_photo.through.objects.filter(photoalbum_id=self.instance.id,author__photoreporter=False)]
#         user = self.current_user
#         if not user.has_perm('frontend.can_socialnet'):
#             self.fields['socialnet'].disabled = True

#     class MyModelMultipleChoiceField(forms.ModelMultipleChoiceField):
#         def label_from_instance(self, obj):
#             return "%s, %s" % (obj.last_name, obj.first_name)

#     title_untypo = forms.CharField(label=u'Заголовок', widget=forms.TextInput(attrs={ 'size': 120 }))
#     image_desc = forms.CharField(label=u'Подпись к фото', required=False, help_text=u'Что изображено, автор, правообладатель и т.п.', widget=forms.TextInput(attrs={ 'size': 120 }))

#     class Meta:
#         model = Poster
#         fields = '__all__'


class WorkAdmin(MultiUploadAdmin):

    inlines = [PosterInlineWork]
    # list_display = [
    #     'id',
    #     'title',
    #     'is_main',
    # ]
    # list_editable = [
    #     'is_main',
    # ]
    # fields = [
    #     'title',
    #     'is_main',
    # ]
    # form = WorkForma
    # save_on_top = True
    actions_on_top = True
    actions_on_bottom = True
    multiupload_list = False
    multiupload_maxfilesize = 15 * 2 ** 20 # 10 Mb

    # clear cache signal
    def save_model(self, request, obj, form, change):
        # try:
        #     form.cleaned_data['author'] = form.cleaned_data['not_active_author'] | form.cleaned_data['author']
        #     form.cleaned_data['author_photo'] = form.cleaned_data['author_photo_not_active'] | form.cleaned_data['author_photo']
        # except:
        #     pass

        # try:
        #     url = obj.get_absolute_url()
        #     key = make_template_fragment_key('photoalbum_v3_article', [url])
        #     cache.delete(key)
        #     #return super(PhotoAlbumAdmin, self).save_model(request, obj, form, change)
        # except:
        #     pass
        return super(WorkAdmin, self).save_model(request, obj, form, change)


    # def process_uploaded_file(self, uploaded, object, request):
    #     '''
    #     Process uploaded file
    #     Parameters:
    #         uploaded: File that was uploaded
    #         object: parent object where multiupload is
    #         request: request Object
    #     Must return a dict with:
    #     return {
    #         'url': 'url to download the file',
    #         'thumbnail_url': 'some url for an image_thumbnail or icon',
    #         'id': 'id of instance created in this method',
    #         'name': 'the name of created file',

    #         # optionals
    #         "size": "filesize",
    #         "type": "file content type",
    #         "delete_type": "POST",
    #         "error" = 'Error message or jQueryFileUpload Error code'
    #     }
    #     '''

    #     f = Poster(image=uploaded, work=object)
    #     f.save()
    #     return {
    #         'url': f.image.url,
    #         'thumbnail_url': str(get_thumbnail(f.image, '100x75', crop='center').url),
    #         'id': f.id,
    #         'name': f.title
    #     }

    def get_form(self,request,obj,**kwargs):
        form = super(WorkAdmin, self).get_form(request, obj, **kwargs)
        form.current_user = request.user
        return form

    # def delete_file(self, pk, request):
    #     '''
    #     Function to delete a file.
    #     '''
    #     # This is the default implementation.
    #     obj = get_object_or_404(self.queryset(request), pk=pk)
    #     obj.delete()


admin.site.register(Work, WorkAdmin)
# admin.site.register(WorkImages)
admin.site.register(News)
admin.site.register(Category)
admin.site.register(User)

# fields = ( 'image_tag', )
# readonly_fields = ('image_tag',)