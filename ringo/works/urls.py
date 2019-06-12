from django.conf.urls import url
from django.urls import include, path
from . import views
from .api.views import WorkListAPIView
import works.api.views

from django.conf.urls import include
from .models import Work, Category
from rest_framework import routers, serializers, viewsets
from django.views.decorators.csrf import csrf_exempt

# Serializers define the API representation.
class WorksSerializer(serializers.ModelSerializer):
    category = serializers.StringRelatedField(many=True)
    user = serializers.StringRelatedField(many=True)

    class Meta:
        model = Work
        fields = ('id', 'title', 'description', 'pub_date', 'launch_date', 'poster', 'user', 'category')
        ordering = ('-pub_date')


# ViewSets define the view behavior.
class WorksViewSet(viewsets.ReadOnlyModelViewSet):
    def get_serializer_class(self):
        if self.action == 'list':
            return WorksSerializer
        return serializers.Default

    def get_queryset(self):
        queryset = Work.objects.all()
        category = self.request.GET.get('category', None)

        if category and category != 'all':
            category_id = Category.objects.get(category_url=category).id
            queryset = queryset.filter(category=category_id).order_by('-pub_date')

        return queryset


# Routers provide an easy way of automatically determining the URL conf.
router = routers.DefaultRouter()
router.register('', WorksViewSet, base_name="work-list")

app_name = 'works'

urlpatterns = [
    path('', views.index, name='index'),
    path('news/', views.news, name='news'),
    path('about/', views.about, name='about'),
    path('<int:work_id>/', views.detail, name='detail'),
    path('contacts/', views.contacts, name='contacts'),
    path('talent/', views.talent, name='talent'),
    path('api/', include(router.urls)),
    # url(r'^api/send_email_to_admin/$', csrf_exempt(works.api.views.send_email_to_admin), name='send_email_to_admin'),
    path('api/send_email_to_admin/<int:some>/', csrf_exempt(works.api.views.send_email_to_admin), name='send_email_to_admin'),
]
