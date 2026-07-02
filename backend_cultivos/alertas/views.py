from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from rest_framework import viewsets, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from mediciones.models import Medicion
from .models import Alerta
from .serializers import AlertaSerializer
from common.mixins import AdminRequiredMixin
from common.auth import is_administrador


@method_decorator(csrf_exempt, name='dispatch')
class AlertaViewSet(AdminRequiredMixin, viewsets.ModelViewSet):
    queryset = Alerta.objects.all().order_by('-fecha_alerta')
    serializer_class = AlertaSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        id_medicion = self.request.query_params.get('id_medicion')
        id_sensor = self.request.query_params.get('id_sensor') or self.request.query_params.get('sensor')
        id_finca = self.request.query_params.get('id_finca') or self.request.query_params.get('finca')
        id_cultivo = self.request.query_params.get('id_cultivo') or self.request.query_params.get('cultivo')
        prioridad = self.request.query_params.get('prioridad')
        leida = self.request.query_params.get('leida')
        atendida = self.request.query_params.get('atendida')

        if id_medicion:
            queryset = queryset.filter(id_medicion=id_medicion)
        if id_sensor:
            queryset = queryset.filter(id_sensor=id_sensor)
        if id_finca:
            queryset = queryset.filter(id_finca=id_finca)
        if id_cultivo:
            queryset = queryset.filter(id_sensor__id_cultivo=id_cultivo)
        if prioridad:
            queryset = queryset.filter(prioridad=prioridad)
        if leida is not None:
            queryset = queryset.filter(leida=leida == 'true')
        if atendida is not None:
            queryset = queryset.filter(atendida=atendida == 'true')
        return queryset


@api_view(['POST'])
def crear_alerta(request):
    tipo_alerta = request.data.get('tipo_alerta')
    descripcion = request.data.get('descripcion')
    prioridad = request.data.get('prioridad', 'media')
    leida = request.data.get('leida', False)
    id_medicion = request.data.get('id_medicion')
    id_sensor = request.data.get('id_sensor')

    if not tipo_alerta or not descripcion:
        return Response({'error': 'Se requieren tipo_alerta y descripcion'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        alerta_data = {
            'tipo_alerta': tipo_alerta,
            'descripcion': descripcion,
            'prioridad': prioridad,
            'leida': leida,
        }

        if id_sensor:
            alerta_data['id_sensor_id'] = id_sensor

        if id_medicion:
            alerta_data['id_medicion_id'] = id_medicion
            try:
                medicion = Medicion.objects.get(pk=id_medicion)
                alerta_data['id_sensor'] = medicion.id_sensor
            except Medicion.DoesNotExist:
                pass

        alerta = Alerta.objects.create(**alerta_data)
        serializer = AlertaSerializer(alerta)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
def alertas_no_leidas(request):
    alertas = Alerta.objects.filter(leida=False).order_by('-fecha_alerta')
    serializer = AlertaSerializer(alertas, many=True)
    return Response(serializer.data)


@api_view(['PATCH'])
def marcar_leida(request, pk=None):
    try:
        alerta = Alerta.objects.get(pk=pk)
        alerta.leida = True
        alerta.save(update_fields=['leida'])
        return Response(AlertaSerializer(alerta).data)
    except Alerta.DoesNotExist:
        return Response({'error': 'Alerta no encontrada'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['PATCH'])
def marcar_atendida(request, pk=None):
    if not is_administrador(request):
        return Response({'error': 'Acceso denegado: solo administradores'}, status=status.HTTP_403_FORBIDDEN)
    try:
        alerta = Alerta.objects.get(pk=pk)
        alerta.atendida = True
        alerta.leida = True
        alerta.save(update_fields=['atendida', 'leida'])
        return Response(AlertaSerializer(alerta).data)
    except Alerta.DoesNotExist:
        return Response({'error': 'Alerta no encontrada'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
def crear_alerta_automatica(request):
    return crear_alerta(request)