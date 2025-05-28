"""
WSGI config for statisticpro project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.1/howto/deployment/wsgi/
"""

import os
#from dotenv import load_dotenv

from django.core.wsgi import get_wsgi_application

# ENVIRONMENT = os.getenv("DJANGO_ENV", "development")
# if ENVIRONMENT == "production":
#     load_dotenv(".env.production")
# else:
#     load_dotenv(".env.development")
settings_module = 'statisticpro.deployment' if 'WEBSITE_HOSTNAME' in os.environ else 'statisticpro.settings'

os.environ.setdefault('DJANGO_SETTINGS_MODULE', settings_module)

application = get_wsgi_application()
