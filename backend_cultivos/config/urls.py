"""
URL configuration for config project.
"""

from django.contrib import admin
from django.urls import path, include
from django.views.decorators.csrf import csrf_exempt
from rest_framework.routers import DefaultRouter

from usuarios.views import login_usuario, registro_usuario, logout_usuario, editar_perfil
from cultivos.views import dashboard_view
from cultivos.views import FincaViewSet, CultivoViewSet, HistorialRiegoViewSet

# Router para cultivos
router_cultivos = DefaultRouter()
router_cultivos.register('fincas', FincaViewSet, basename='fincas')
router_cultivos.register('cultivos', CultivoViewSet, basename='cultivos')
router_cultivos.register('riegos', HistorialRiegoViewSet, basename='riegos')

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # API endpoints
    path('api/login/', csrf_exempt(login_usuario), name='login'),
    path('api/logout/', csrf_exempt(logout_usuario), name='logout'),
    path('api/registro/', csrf_exempt(registro_usuario), name='registro'),
    path('api/dashboard/', dashboard_view, name='dashboard'),
    
    # Usuarios
    path('api/usuarios/', include('usuarios.urls')),
    
    # Fincas y Cultivos
    path('api/', include(router_cultivos.urls)),
    
    # Sensores
    path('api/sensores/', include('sensores.urls')),
    
    # Mediciones
    path('api/mediciones/', include('mediciones.urls')),
    
    # Alertas
    path('api/alertas/', include('alertas.urls')),
]