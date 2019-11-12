from django.http import Http404, JsonResponse, HttpResponse, HttpResponsePermanentRedirect, HttpResponseRedirect, HttpResponseGone
from django.shortcuts import render, get_object_or_404
from django.utils import timezone
from smtplib import SMTPException
from django.conf import settings
from django.core.mail import EmailMessage
from django.core.mail import send_mail
import smtplib

import json
import django

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

    email_body = """\
    <html>
      <head></head>
      <body>
        <h3>Здравствуйте!</h3>
        <p>%s</p>
        <h5>С уважением, %s</h5>
        <h5 style="margin: 0 0 7px; font-weight:normal;">Компания: <b>%s</b></h5>
        <h5 style="margin: 0 0 7px; font-weight:normal;">Сайт: %s</h5>
        <h5 style="margin: 0 0 7px; font-weight:normal;">E-mail: <b>%s</b></h5>
      </body>
    </html>
    """ % (message, name, company, website, email)

    msg = EmailMessage(
        subject      = reason,
        body         = email_body,
        to           = [settings.EMAIL_HOST_USER],
        reply_to     = [email],
        # headers={'From': email},
        # fail_silently=False
    )
    msg.content_subtype = 'html'

    try:
        msg.send()
        status = 'success'
    except SMTPException as e:
        status = 'fail'
        print('[ERROR]:', e)

    return HttpResponse(json.dumps(status), 'application/javascript')
