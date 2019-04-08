from django.conf.urls import url
# from django.urls import include, path

from .views import WorkListAPIView

urlpatterns = [
    url(r'^$', WorkListAPIView.as_view(), name='work-list')
]
