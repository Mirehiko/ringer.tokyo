from django.http import Http404, JsonResponse, HttpResponse, HttpResponsePermanentRedirect, HttpResponseRedirect, HttpResponseGone
from django.shortcuts import render, get_object_or_404
from django.utils import timezone
from smtplib import SMTPException
from django.conf import settings
from django.core.mail import EmailMessage
import smtplib

import json

from .serializers import WorkSerializer
from rest_framework import generics
from rest_framework.permissions import IsAdminUser

from works.models import Work

class WorkListAPIView(generics.ListAPIView):
    lookup_field = 'pk'
    queryset = Work.objects.all()
    serializer_class = WorkSerializer
    permission_classes = (IsAdminUser,)


def send_email_to_admin(request, some):

    name = request.POST.get('name', '')
    company = request.POST.get('company', '')
    email = request.POST.get('email', '')
    website = request.POST.get('website', '')
    reason = request.POST.get('reason', '')
    message = request.POST.get('message', '')
    status = ''

    try:
        msg = EmailMessage(
            subject=reason,
            body=message,
            from_email=settings.EMAIL_HOST_USER,
            to=(settings.EMAIL_HOST_USER,),
            headers={'From': email}
        )
        msg.content_subtype = 'html'
        msg.send()

        status = 'success'
    except SMTPException as e:
        status = 'fail'
        print('[ERROR]:', e)

    return HttpResponse(json.dumps(status), 'application/javascript')
