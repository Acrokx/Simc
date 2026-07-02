from django.urls import path
from . import views

urlpatterns = [
    # Rutas específicas primero
    path('login/', views.login_usuario, name='login_usuario'),
    path('registro/', views.registro_usuario, name='registro_usuario'),
    path('agricultores/', views.agricultores_view, name='agricultores'),
    path('eliminar/<int:pk>/', views.eliminar_agricultor, name='eliminar_agricultor'),
    path('editar/<int:pk>/', views.editar_agricultor, name='editar_agricultor'),
    path('', views.crear_usuario_admin, name='usuario_create'),
    path('<int:pk>/', views.usuario_detail, name='usuario_detail'),
    # Perfil después del router para evitar conflictas
    path('perfil/', views.editar_perfil, name='editar_perfil'),
]
