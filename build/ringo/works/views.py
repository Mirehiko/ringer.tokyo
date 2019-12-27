from django.http import Http404, HttpResponse, JsonResponse
from django.template import loader
from django.shortcuts import render
from django.conf import settings
from functools import wraps

from .models import Work, News, Category, WorkImages, WorkVideo
from django.views.decorators.csrf import csrf_protect



def index(request):
    work_list = Work.objects.order_by('-pub_date')
    category_list = Category.objects.all()

    context = {
        'work_list': work_list,
        'category_list': category_list,
    }

    return render(request, 'works/home.html', context )



def category(request):
    category_name = request.GET.get('category', None)

    try:
        # work_list = Work.objects.filter(category = category_id).order_by('-pub_date')
        if category_name == 'all':
            work_list = Work.objects.order_by('-pub_date')
        else:
            category_id = Category.objects.get(category_url=category).id
            work_list = Work.objects.filter(category = category_id).order_by('-pub_date')

    except Work.DoesNotExist:
        raise Http404("Work does not exist")

    # category_list = Category.objects.all()

    context = {
        'work_list': work_list,
        # 'category_list': category_list,
    }


    return JsonResponse(context)


def news(request):
    news_list = News.objects.order_by('-pub_date')
    context = {
        'news_list': news_list,
    }

    return render(request, 'works/news.html', context )


def about(request):
    latest_work_list = Work.objects.order_by('-pub_date')
    context = {
        'latest_work_list': latest_work_list,
    }

    return render(request, 'works/about.html', context )

@csrf_protect
def contacts(request):
    # latest_work_list = Work.objects.order_by('-pub_date')
    context = {
        # 'latest_work_list': latest_work_list,
        'site_key': settings.RECAPTCHA_SITE_KEY,
    }

    return render(request, 'works/contacts.html', context )


def detail(request, work_id):
    try:
        work = Work.objects.get(pk=work_id)
    except Work.DoesNotExist:
        raise Http404("Work does not exist")

    next_obj = Work.objects.filter(pub_date__gt=work.pub_date).first() or Work.objects.first()
    prev_obj = Work.objects.filter(pub_date__lt=work.pub_date).last() or Work.objects.last()

    return render(request, 'works/work_detail.html', {
        'work': work,
        'images': work.images.all(),
        'videofiles': work.videos.all(),
        'prev': prev_obj.id,
        'next': next_obj.id,
    })


def talent(request):
    latest_work_list = Work.objects.order_by('-pub_date')
    context = {
        'latest_work_list': latest_work_list,
    }

    return render(request, 'works/talent.html', context )


