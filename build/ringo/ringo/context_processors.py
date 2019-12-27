from django.conf import settings

def site_processor(request):
    return {
        'settings': {
            'STATIC_VERSION': settings.STATIC_VERSION,
            'SITE_NAME': settings.SITE_NAME,
            'CSS_VER': settings.CSS_VER,
            'JS_VER': settings.JS_VER,
            'DEFAULT_VIDEO': settings.DEFAULT_VIDEO,
        }
    }