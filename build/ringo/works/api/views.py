from django.http import Http404, JsonResponse, HttpResponse, HttpResponsePermanentRedirect, HttpResponseRedirect, HttpResponseGone
from django.shortcuts import render, get_object_or_404
from django.utils import timezone
from smtplib import SMTPException
from django.conf import settings
from django.core.mail import EmailMessage
from django.core.mail import send_mail
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils.html import strip_tags

import smtplib
import json
import django
import urllib

from django.conf import settings
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

    token = request.POST.get('token', '')
    url = 'https://www.google.com/recaptcha/api/siteverify'
    payload = {
        'secret': settings.RECAPTCHA_SECRET_KEY,
        'response': token
    }
    data = urllib.parse.urlencode(payload).encode()
    req = urllib.request.Request(url, data=data)

    # verify the token submitted with the form is valid
    response = urllib.request.urlopen(req)
    result = json.loads(response.read().decode())

    # result will be a dict containing 'success' and 'action'.
    # it is important to verify both
    if (not result['success']) or (not result['action'] == 'homepage'):  # make sure action matches the one from your template
        messages.error(request, 'Invalid reCAPTCHA. Please try again.')
        # return super().form_invalid(form)
        return HttpResponse(json.dumps('spamer'), 'application/javascript')

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

    send_email_to_user(name, email)


    return HttpResponse(json.dumps(status), 'application/javascript')

def send_email_to_user(name, email):

    # email_body = """\
    # <html>
    #   <head></head>
    #   <body>
    #     <p>Уважаемый %s, ваше письмо было отправлено администратору сайта CAR-TUBE</p>
    #     <h5>С уважением, администрация сайта</h5>
    #     <h5 style="margin: 0 0 7px; font-weight:normal;">Сайт: <b>http://car-tube.ru/</b></h5>
    #   </body>
    # </html>
    # """ % (name)
    email_body = 'Уважаемый %s, ваше письмо было отправлено администратору сайта.\nС уважением, http://car-tube.ru/\nDear %s, your letter was sent to the site administrator.\nThanks & Regards, http://car-tube.ru/' % (name,name)
    # msg = send_mail('Уведомление о доставке', email_body, settings.EMAIL_HOST_USER, [email])
    # msg.content_subtype = 'html'

    try:
        # msg.send()
        send_mail('Уведомление о доставке', email_body, settings.EMAIL_HOST_USER, [email])
    except SMTPException as e:
        print('[ERROR SEND TO USER]:', e)
