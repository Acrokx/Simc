from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register('umbrales', views.ConfiguracionInteligenteViewSet, basename='umbrales')
router.register('sistema', views.ConfiguracionSistemaViewSet, basename='sistema')

urlpatterns = [
    path('', include(router.urls)),
    path('evaluar-reglas/', views.evaluar_reglas_inteligentes, name='evaluar_reglas_inteligentes'),
    path('reporte-alertas/', views.generar_reporte_alertas, name='generar_reporte_alertas'),
    path('reporte-alertas-excel/', views.reporte_alertas_excel, name='reporte_alertas_excel'),
    path('reporte-alertas-pdf/', views.reporte_alertas_pdf, name='reporte_alertas_pdf'),
    path('reporte-mediciones-csv/', views.reporte_mediciones_csv, name='reporte_mediciones_csv'),
    path('reporte-sensores-csv/', views.reporte_sensores_csv, name='reporte_sensores_csv'),
    path('reporte-cultivos-csv/', views.reporte_cultivos_csv, name='reporte_cultivos_csv'),
    path('reporte-riego/', views.generar_reporte_riego, name='generar_reporte_riego'),
    path('backup/', views.generar_backup, name='generar_backup'),
    path('estadisticas/', views.estadisticas_historicas, name='estadisticas_historicas'),
]
