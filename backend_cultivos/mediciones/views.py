import random
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from rest_framework import viewsets, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Medicion
from .serializers import MedicionSerializer
from sensores.models import Sensor
from alertas.models import Alerta
from common.mixins import AdminRequiredMixin
from common.auth import is_administrador





@api_view(['POST'])
def crear_medicion(request):
    sensor_id = request.data.get('id_sensor') or request.data.get('sensor_id')
    valor_humedad = request.data.get('valor_humedad')

    if not sensor_id or valor_humedad is None:
        return Response({'error': 'Se requieren id_sensor y valor_humedad'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        sensor = Sensor.objects.get(pk=sensor_id)
        medicion = Medicion.objects.create(id_sensor=sensor, valor_humedad=valor_humedad)
        _crear_alerta_por_rango(sensor, medicion)
        serializer = MedicionSerializer(medicion)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    except Sensor.DoesNotExist:
        return Response({'error': 'Sensor no encontrado'}, status=status.HTTP_404_NOT_FOUND)


def _crear_alerta_por_rango(sensor: Sensor, medicion: Medicion) -> None:
    try:
        valor = float(medicion.valor_humedad)
        if sensor.rango_min is not None and valor < sensor.rango_min:
            Alerta.objects.create(
                tipo_alerta='Valor bajo',
                descripcion=f'El sensor {sensor.codigo_sensor or sensor.tipo_sensor} reportó valor bajo ({valor}).',
                prioridad='alta', id_sensor=sensor, id_medicion=medicion,
            )
        elif sensor.rango_max is not None and valor > sensor.rango_max:
            Alerta.objects.create(
                tipo_alerta='Valor alto',
                descripcion=f'El sensor {sensor.codigo_sensor or sensor.tipo_sensor} reportó valor alto ({valor}).',
                prioridad='alta', id_sensor=sensor, id_medicion=medicion,
            )
    except (ValueError, TypeError):
        pass


@api_view(['POST'])
def simular_mediciones(request):
    if not is_administrador(request):
        return Response({'error': 'Acceso denegado: solo administradores'}, status=status.HTTP_403_FORBIDDEN)
    sensores = Sensor.objects.all()
    mediciones_creadas = []
    for sensor in sensores:
        valor_humedad = round(random.uniform(15.0, 90.0), 2)
        medicion = Medicion.objects.create(id_sensor=sensor, valor_humedad=valor_humedad)
        _crear_alerta_por_rango(sensor, medicion)
        mediciones_creadas.append(medicion.id_medicion)
    return Response({'simuladas': len(mediciones_creadas), 'mediciones': mediciones_creadas}, status=status.HTTP_201_CREATED)


@method_decorator(csrf_exempt, name='dispatch')
class MedicionViewSet(AdminRequiredMixin, viewsets.ModelViewSet):
    queryset = Medicion.objects.all().order_by('-fecha_medicion')
    serializer_class = MedicionSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        sensor_id = self.request.query_params.get('id_sensor') or self.request.query_params.get('sensor')
        if sensor_id:
            queryset = queryset.filter(id_sensor=sensor_id)
        if not self.request.query_params:
            queryset = queryset[:50]
        return queryset


@api_view(['GET'])
def ultima_medicion(request):
    sensor_id = request.query_params.get('id_sensor')
    if not sensor_id:
        return Response({'error': 'Se requiere id_sensor'}, status=status.HTTP_400_BAD_REQUEST)
    try:
        medicion = Medicion.objects.filter(id_sensor=sensor_id).order_by('-fecha_medicion').first()
        if medicion:
            return Response(MedicionSerializer(medicion).data)
        return Response({'message': 'No hay mediciones'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
