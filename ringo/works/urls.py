from django.urls import path
from . import views

app_name = 'works'

urlpatterns = [
    path('', views.index, name='index'),
    path('news/', views.news, name='news'),
    path('about/', views.about, name='about'),
    path('<int:work_id>/', views.detail, name='detail'),
    path('contacts/', views.contacts, name='contacts'),
    # path('category/<int:category_id>/', views.category, name='category'),
    path('category/<category>/', views.category, name='category'),
    # path(r'^category/$', views.category, name='category'),
    path('talent/', views.talent, name='talent'),
    # path('recruit/', views.recruit, name='recruit'),getWorksByCategory
]
r'^(?P<rubric>[-\w]+)/$'
