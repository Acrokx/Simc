import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = os.environ.get(
    'DJANGO_SECRET_KEY',
    'django-insecure-8k4x9p9u5f1z0m8j2r7n4c6t1s3b9v5q0w2h6d4l8y9p0x5v3n6m2k7q1r9t'
)

DEBUG = os.environ.get('DJANGO_DEBUG', 'False').lower() == 'true'
APPEND_SLASH = False

_raw_hosts = os.environ.get('ALLOWED_HOSTS', 'localhost,127.0.0.1,10.0.2.2,testserver,192.168.1.11')
_ALLOWED_HOSTS = [host.strip() for host in _raw_hosts.split(',') if host.strip()]
if '*' in _ALLOWED_HOSTS and not DEBUG:
    _ALLOWED_HOSTS.remove('*')
if not _ALLOWED_HOSTS:
    _ALLOWED_HOSTS = ['localhost', '127.0.0.1'] if DEBUG else []
ALLOWED_HOSTS = _ALLOWED_HOSTS

SECURE_SSL_REDIRECT = os.environ.get('DJANGO_SECURE_SSL_REDIRECT', 'False').lower() == 'true'
SECURE_HSTS_SECONDS = 31536000 if not DEBUG and SECURE_SSL_REDIRECT else 0
SECURE_HSTS_INCLUDE_SUBDOMAINS = not DEBUG and SECURE_SSL_REDIRECT
SECURE_HSTS_PRELOAD = not DEBUG and SECURE_SSL_REDIRECT
SESSION_COOKIE_SECURE = os.environ.get('DJANGO_SESSION_COOKIE_SECURE', 'False').lower() == 'true'
CSRF_COOKIE_SECURE = os.environ.get('DJANGO_CSRF_COOKIE_SECURE', 'False').lower() == 'true'

if not DEBUG:
    SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'corsheaders',
    'usuarios',
    'cultivos',
    'sensores',
    'mediciones',
    'alertas',
    'configuracion',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'config.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'config.wsgi.application'

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

LANGUAGE_CODE = 'es-co'
TIME_ZONE = 'America/Bogota'
USE_I18N = True
USE_TZ = True

STATIC_URL = 'static/'
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.AllowAny',
    ],
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.SessionAuthentication',
    ],
    'EXCEPTION_HANDLER': 'config.exception_handler.custom_exception_handler',
}

FRONTEND_ORIGIN = os.environ.get('DJANGO_FRONTEND_ORIGIN', 'http://localhost:8081')
CORS_ALLOWED_ORIGINS = [
    FRONTEND_ORIGIN,
    'http://localhost:19006',
    'http://localhost:3000',
    'http://127.0.0.1:8000',
]
CORS_ALLOW_HEADERS = list(__import__('corsheaders.defaults').defaults.default_headers) + [
    'X-Usuario',
    'X-Password',
]
