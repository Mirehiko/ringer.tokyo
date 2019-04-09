from django.urls import include, path
from . import views
from .api.views import WorkListAPIView

from django.conf.urls import include
from .models import Work, Category
from rest_framework import routers, serializers, viewsets


# Serializers define the API representation.
class WorksSerializer(serializers.ModelSerializer):
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
    path('category/$', views.category, name='category'),
    path('talent/', views.talent, name='talent'),
    path('api/', include(router.urls)),
]
