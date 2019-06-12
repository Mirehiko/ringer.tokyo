from django.conf.urls import url
from django.urls import  path

from .views import WorkListAPIView
# import works.api.views

urlpatterns = [
    url(r'^$', WorkListAPIView.as_view(), name='work-list')
]
