"""
WSGI config for bloquesite project on PythonAnywhere.

This file contains the WSGI configuration required to serve your Django
application on PythonAnywhere.

Instructions:
1. Upload this file to your PythonAnywhere account
2. Copy the content to /var/www/yourusername_pythonanywhere_com_wsgi.py
3. Update the paths with your actual username and project location
"""

import os
import sys

# Add your project directory to the sys.path
# Replace 'yourusername' with your actual PythonAnywhere username
path = '/home/yourusername/marketsphere/bloquesite'
if path not in sys.path:
    sys.path.append(path)

# Set the Django settings module
os.environ['DJANGO_SETTINGS_MODULE'] = 'bloquesite.settings'

# Import Django's WSGI application
from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()