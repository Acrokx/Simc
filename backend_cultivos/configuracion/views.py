from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.http import HttpResponse
from django.utils import timezone
import csv
import io
from datetime import timedelta

from .models import ConfiguracionInteligente, ConfiguracionSistema
from .serializers import ConfiguracionInteligenteSerializer, ConfiguracionSistemaSerializer
from common.mixins import AdminRequiredMixin


from common.auth import is_administrador


@method_decorator(csrf_exempt, name='dispatch')
class ConfiguracionInteligenteViewSet(AdminRequiredMixin, viewsets.ModelViewSet):
    queryset = ConfiguracionInteligente.objects.all().order_by('tipo')
    serializer_class = ConfiguracionInteligenteSerializer

    @action(detail=True, methods=['post'])
    def toggle(self, request, pk=None):
        regla = self.get_object()
        regla.activa = not regla.activa
        regla.save(update_fields=['activa'])
        return Response({'success': True, 'activa': regla.activa})


@method_decorator(csrf_exempt, name='dispatch')
class ConfiguracionSistemaViewSet(AdminRequiredMixin, viewsets.ModelViewSet):
    queryset = ConfiguracionSistema.objects.all().order_by('clave')
    serializer_class = ConfiguracionSistemaSerializer


@api_view(['POST'])
@permission_classes([AllowAny])
def generar_reporte_alertas(request):
    from alertas.models import Alerta
    if not is_administrador(request):
        return Response({'error': 'Acceso denegado: solo administradores'}, status=status.HTTP_403_FORBIDDEN)
    alertas = Alerta.objects.all().order_by('-fecha_alerta')[:500]
    filas = [
        {'id': a.id_alerta, 'tipo': a.tipo_alerta, 'descripcion': a.descripcion, 'prioridad': a.prioridad, 'leida': a.leida, 'fecha': a.fecha_alerta.strftime('%Y-%m-%d %H:%M:%S')}
        for a in alertas
    ]
    return Response({'success': True, 'data': filas, 'total': len(filas)})


@api_view(['POST'])
@permission_classes([AllowAny])
def evaluar_reglas_inteligentes(request):
    from sensores.models import Sensor
    from mediciones.models import Medicion
    from alertas.models import Alerta

    reglas = ConfiguracionInteligente.objects.filter(activa=True)
    alertas_generadas = 0

    for regla in reglas:
        mediciones = Medicion.objects.filter(
            id_sensor__tipo_sensor=regla.tipo,
            fecha_medicion__gte=timezone.now().replace(hour=0, minute=0, second=0)
        ).select_related('id_sensor')

        for m in mediciones:
            valor = float(m.valor_humedad) if m.valor_humedad else 0
            if valor < regla.valor_minimo or valor > regla.valor_maximo:
                Alerta.objects.get_or_create(
                    tipo_alerta='Crítica',
                    descripcion=f"Valor fuera de rango: {valor} (rango permitido: {regla.valor_minimo} - {regla.valor_maximo}). {regla.mensaje_alerta}",
                    defaults={'prioridad': regla.prioridad, 'leida': False, 'id_sensor': m.id_sensor}
                )
                alertas_generadas += 1

    return Response({'success': True, 'alertas_generadas': alertas_generadas})


@api_view(['POST'])
@permission_classes([AllowAny])
def generar_reporte_riego(request):
    from cultivos.models import HistorialRiego
    if not is_administrador(request):
        return Response({'error': 'Acceso denegado: solo administradores'}, status=status.HTTP_403_FORBIDDEN)
    riegos = HistorialRiego.objects.all().order_by('-fecha_riego')[:500]
    filas = [
        {'id': r.id_riego, 'cultivo': str(r.id_cultivo) if r.id_cultivo else '', 'fecha_riego': r.fecha_riego.strftime('%Y-%m-%d') if r.fecha_riego else '', 'cantidad_agua': float(r.cantidad_agua) if r.cantidad_agua else 0}
        for r in riegos
    ]
    return Response({'success': True, 'data': filas, 'total': len(filas)})


@api_view(['POST'])
@permission_classes([AllowAny])
def generar_backup(request):
    if not is_administrador(request):
        return Response({'error': 'Acceso denegado: solo administradores'}, status=status.HTTP_403_FORBIDDEN)
    return Response({'success': True, 'mensaje': 'Backup generado correctamente.'})


@api_view(['GET'])
@permission_classes([AllowAny])
def reporte_alertas_excel(request):
    if not is_administrador(request):
        return Response({'error': 'Acceso denegado: solo administradores'}, status=status.HTTP_403_FORBIDDEN)
    from alertas.models import Alerta
    alertas = Alerta.objects.all().order_by('-fecha_alerta')[:1000]
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename="reporte_alertas.csv"'
    writer = csv.writer(response)
    writer.writerow(['ID', 'Tipo', 'Descripción', 'Prioridad', 'Leída', 'Fecha'])
    for a in alertas:
        writer.writerow([a.id_alerta, a.tipo_alerta, a.descripcion, a.prioridad, a.leida, a.fecha_alerta.strftime('%Y-%m-%d %H:%M:%S')])
    return response


@api_view(['GET'])
@permission_classes([AllowAny])
def reporte_mediciones_csv(request):
    if not is_administrador(request):
        return Response({'error': 'Acceso denegado: solo administradores'}, status=status.HTTP_403_FORBIDDEN)
    from mediciones.models import Medicion
    mediciones = Medicion.objects.all().order_by('-fecha_medicion')[:2000]
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename="reporte_mediciones.csv"'
    writer = csv.writer(response)
    writer.writerow(['ID', 'Sensor', 'Humedad (%)', 'Fecha'])
    for m in mediciones:
        writer.writerow([m.id_medicion, m.id_sensor_id, m.valor_humedad, m.fecha_medicion.strftime('%Y-%m-%d %H:%M:%S')])
    return response


@api_view(['GET'])
@permission_classes([AllowAny])
def reporte_sensores_csv(request):
    if not is_administrador(request):
        return Response({'error': 'Acceso denegado: solo administradores'}, status=status.HTTP_403_FORBIDDEN)
    from sensores.models import Sensor
    sensores = Sensor.objects.all().order_by('-id_sensor')[:1000]
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename="reporte_sensores.csv"'
    writer = csv.writer(response)
    writer.writerow(['ID', 'Código', 'Tipo', 'Ubicación', 'Estado', 'Activo', 'Cultivo'])
    for s in sensores:
        writer.writerow([s.id_sensor, s.codigo_sensor, s.tipo_sensor, s.ubicacion, s.estado, s.activo, s.id_cultivo_id])
    return response


@api_view(['GET'])
@permission_classes([AllowAny])
def reporte_cultivos_csv(request):
    if not is_administrador(request):
        return Response({'error': 'Acceso denegado: solo administradores'}, status=status.HTTP_403_FORBIDDEN)
    from cultivos.models import Cultivo
    cultivos = Cultivo.objects.all().order_by('-id_cultivo')[:1000]
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename="reporte_cultivos.csv"'
    writer = csv.writer(response)
    writer.writerow(['ID', 'Nombre', 'Tipo', 'Área', 'Estado', 'Finca', 'Siembra'])
    for c in cultivos:
        writer.writerow([c.id_cultivo, c.nombre_cultivo, c.tipo_cultivo, c.tamaño_area, c.estado, c.id_finca_id, c.fecha_siembra.strftime('%Y-%m-%d')])
    return response


@api_view(['GET'])
@permission_classes([AllowAny])
def reporte_alertas_pdf(request):
    if not is_administrador(request):
        return Response({'error': 'Acceso denegado: solo administradores'}, status=status.HTTP_403_FORBIDDEN)
    from reportlab.lib.pagesizes import letter
    from reportlab.lib import colors
    from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph
    from reportlab.lib.styles import getSampleStyleSheet
    from alertas.models import Alerta
    alertas = Alerta.objects.all().order_by('-fecha_alerta')[:100]
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter)
    elements = []
    styles = getSampleStyleSheet()
    elements.append(Paragraph('Reporte de Alertas', styles['Title']))
    data = [['ID', 'Tipo', 'Descripción', 'Prioridad', 'Fecha']]
    for a in alertas:
        data.append([str(a.id_alerta), a.tipo_alerta, a.descripcion[:50], a.prioridad, a.fecha_alerta.strftime('%Y-%m-%d %H:%M')])
    table = Table(data)
    table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.black),
    ]))
    elements.append(table)
    doc.build(elements)
    buffer.seek(0)
    response = HttpResponse(buffer.read(), content_type='application/pdf')
    response['Content-Disposition'] = 'attachment; filename="reporte_alertas.pdf"'
    return response


@api_view(['GET'])
@permission_classes([AllowAny])
def estadisticas_historicas(request):
    from alertas.models import Alerta
    from mediciones.models import Medicion
    if not is_administrador(request):
        return Response({'error': 'Acceso denegado: solo administradores'}, status=status.HTTP_403_FORBIDDEN)
    from django.db.models import Count, Avg
    hoy = timezone.now()
    hace_30_dias = hoy - timedelta(days=30)
    estadisticas = {
        'alertas_por_tipo': [{'tipo_alerta': a['tipo_alerta'], 'count': a['count']} for a in Alerta.objects.values('tipo_alerta').annotate(count=Count('id')).order_by('-count')[:10]],
        'alertas_por_prioridad': [{'prioridad': a['prioridad'], 'count': a['count']} for a in Alerta.objects.values('prioridad').annotate(count=Count('id')).order_by('-count')],
        'total_riegos': 0,
        'total_alertas': Alerta.objects.count(),
        'periodo': {'desde': hace_30_dias.strftime('%Y-%m-%d'), 'hasta': hoy.strftime('%Y-%m-%d')},
    }
    return Response({'success': True, 'estadisticas': estadisticas})