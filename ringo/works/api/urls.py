from django.urls import include, path

from .views import WorkListAPIView

urlpatterns = [
    path(r'^$', WorkListAPIView.as_view(), name='work-list')
]
