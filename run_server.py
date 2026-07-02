import subprocess
import os
import sys
import time

os.chdir(os.path.join(os.path.dirname(__file__), 'backend_cultivos'))
sys.path.insert(0, os.getcwd())

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
import django
django.setup()

from django.core.management import call_command

print("Starting Django server on port 8000...")
call_command('runserver', '0.0.0.0:8000', use_reloader=False)