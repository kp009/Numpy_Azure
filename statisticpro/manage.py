#!/usr/bin/env python
"""Django's command-line utility for administrative tasks."""
import os
import sys
# from dotenv import load_dotenv

# # Load the correct .env based on DJANGO_ENV
# ENVIRONMENT = os.getenv("DJANGO_ENV", "development")

# if ENVIRONMENT == "production":
#     load_dotenv(".env.production")
# else:
#     load_dotenv(".env.development")

def main():
    """Run administrative tasks."""
    settings_module = 'statisticpro.deployment' if 'WEBSITE_HOSTNAME' in os.environ else 'statisticpro.settings'

    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'statisticpro.settings')
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc
    execute_from_command_line(sys.argv)


if __name__ == '__main__':
    main()
