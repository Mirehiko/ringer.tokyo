from django.http import Http404, HttpResponse
from django.template import loader
from django.shortcuts import render

from .models import Work
from .models import News
from .models import Category


def index(request):

    work_list = Work.objects.order_by('-pub_date')
    category_list = Category.objects.all()

    context = {
        'work_list': work_list,
        'category_list': category_list,
    }

    return render(request, 'works/home.html', context )


def category(request, category_id):
    try:
        work_list = Work.objects.filter(category = category_id).order_by('-pub_date')
    except Work.DoesNotExist:
        raise Http404("Work does not exist")

    category_list = Category.objects.all()

    context = {
        'work_list': work_list,
        'category_list': category_list,
    }

    return render(request, 'works/home.html', context )


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


def contacts(request):
    latest_work_list = Work.objects.order_by('-pub_date')
    context = {
        'latest_work_list': latest_work_list,
    }

    return render(request, 'works/contacts.html', context )


def detail(request, work_id):
    try:
        work = Work.objects.get(pk=work_id)
    except Work.DoesNotExist:
        raise Http404("Work does not exist")

    return render(request, 'works/work_detail.html', {'work': work})


def talent(request):
    latest_work_list = Work.objects.order_by('-pub_date')
    context = {
        'latest_work_list': latest_work_list,
    }

    return render(request, 'works/talent.html', context )

# def workAdmin(request):
#     work_list = Work.objects.order_by('-pub_date')
#     category_list = Category.objects.all()

#     context = {
#         'work_list': work_list,
#         'category_list': category_list,
#     }

#     return render(request, 'admin/list.html', context )


# def addWork(request):
#     category_list = Category.objects.all()

#     context = {
#         'exist': False,
#         'category_list': category_list,
#     }

#     return render(request, 'admin/work.html', context )


# def editWork(request, work_id):
#     try:
#         work = Work.objects.get(pk=work_id)
#     except Work.DoesNotExist:
#         raise Http404("Work does not exist")

#     category_list = Category.objects.all()

#     context = {
#         'exist': True,
#         'work': work,
#         'category_list': category_list,
#     }

#     return render(request, 'admin/work.html', context )


# def updateWork(request, work_id):


# def removeWork(request, id):
#     work_list = Work.objects.order_by('-pub_date')

#     context = {
#         'work_list': work_list,
#         'category_list': category_list,
#     }

#     return render(request, 'admin/list.html', context )
