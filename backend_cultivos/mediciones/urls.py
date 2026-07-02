from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register('', views.MedicionViewSet, basename='medicion')

urlpatterns = [
    path('crear/', views.crear_medicion, name='crear_medicion'),
    path('ultima/', views.ultima_medicion, name='ultima_medicion'),
    path('simular/', views.simular_mediciones, name='simular_mediciones'),
    path('', include(router.urls)),
]
