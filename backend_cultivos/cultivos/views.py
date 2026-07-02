from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Finca, Cultivo, HistorialRiego
from .serializers import FincaSerializer, CultivoSerializer, HistorialRiegoSerializer
from common.mixins import AdminRequiredMixin, AdminOrOwnerRequiredMixin


@api_view(['GET'])
def dashboard_view(request):
    from sensores.models import Sensor
    from mediciones.models import Medicion
    from alertas.models import Alerta
    from usuarios.models import Usuario
    
    try:
        num_fincas = Finca.objects.count()
        num_cultivos = Cultivo.objects.count()
        num_sensores = Sensor.objects.count()
        sensores_activos = Sensor.objects.filter(activo=True).count()
        num_alertas_activas = Alerta.objects.filter(leida=False).count()
        num_usuarios = Usuario.objects.filter(bloqueado=False).count()
        mediciones_count = Medicion.objects.count()
        
        avg_vals = list(Medicion.objects.values_list('valor_humedad', flat=True)[:100])
        promedio_humedad = round(sum(avg_vals) / len(avg_vals), 2) if avg_vals else None
        
        ultima_medicion = Medicion.objects.order_by('-fecha_medicion').first()
        ultima_medicion_json = None
        if ultima_medicion:
            ultima_medicion_json = {
                'valor': float(ultima_medicion.valor_humedad),
                'sensor': ultima_medicion.id_sensor.tipo_sensor if ultima_medicion.id_sensor else None,
                'fecha': ultima_medicion.fecha_medicion.strftime('%Y-%m-%d %H:%M:%S'),
            }
        
        cultivos_por_finca = [
            {'nombre_finca': f.nombre_finca, 'cultivos': Cultivo.objects.filter(id_finca=f.id_finca).count()}
            for f in Finca.objects.all()
        ]
        
        return Response({
            'success': True,
            'data': {
                'num_fincas': num_fincas,
                'num_cultivos': num_cultivos,
                'num_sensores': num_sensores,
                'sensores_activos': sensores_activos,
                'sensores_inactivos': num_sensores - sensores_activos,
                'num_alertas_activas': num_alertas_activas,
                'num_alertas_criticas': Alerta.objects.filter(prioridad='alta').count(),
                'num_usuarios': num_usuarios,
                'num_usuarios_conectados': num_usuarios,
                'mediciones_count': mediciones_count,
                'promedio_humedad': promedio_humedad,
                'cultivos_por_finca': cultivos_por_finca,
                'ultima_medicion': ultima_medicion_json,
            }
        })
    except Exception as e:
        return Response({'success': False, 'error': str(e)}, status=500)


@method_decorator(csrf_exempt, name='dispatch')
class FincaViewSet(AdminOrOwnerRequiredMixin, viewsets.ModelViewSet):
    queryset = Finca.objects.all().order_by('-id_finca')
    serializer_class = FincaSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        usuario_id = self.request.query_params.get('id_usuario')
        if usuario_id:
            try:
                queryset = queryset.filter(id_usuario=int(usuario_id))
            except (ValueError, TypeError):
                pass
        return queryset

    def perform_create(self, serializer):
        usuario_id = self.request.data.get('id_usuario')
        if usuario_id:
            try:
                from usuarios.models import Usuario
                usuario = Usuario.objects.get(pk=usuario_id)
                serializer.save(id_usuario=usuario)
            except Exception:
                serializer.save()
        else:
            serializer.save()


@method_decorator(csrf_exempt, name='dispatch')
class CultivoViewSet(AdminRequiredMixin, viewsets.ModelViewSet):
    queryset = Cultivo.objects.all().order_by('-id_cultivo')
    serializer_class = CultivoSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        finca_id = self.request.query_params.get('id_finca') or self.request.query_params.get('finca')
        if finca_id:
            queryset = queryset.filter(id_finca=finca_id)
        return queryset


@method_decorator(csrf_exempt, name='dispatch')
class HistorialRiegoViewSet(AdminRequiredMixin, viewsets.ModelViewSet):
    queryset = HistorialRiego.objects.all().order_by('-fecha_riego')
    serializer_class = HistorialRiegoSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        cultivo_id = self.request.query_params.get('id_cultivo')
        if cultivo_id:
            queryset = queryset.filter(id_cultivo=cultivo_id)
        return queryset