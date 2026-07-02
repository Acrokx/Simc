from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Sensor
from .serializers import SensorSerializer
from mediciones.models import Medicion
from mediciones.serializers import MedicionSerializer
from common.mixins import AdminRequiredMixin


@method_decorator(csrf_exempt, name='dispatch')
class SensorViewSet(AdminRequiredMixin, viewsets.ModelViewSet):
    queryset = Sensor.objects.all().order_by('-id_sensor')
    serializer_class = SensorSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        tipo_sensor = self.request.query_params.get('tipo_sensor') or self.request.query_params.get('tipo')
        estado = self.request.query_params.get('estado')
        id_cultivo = self.request.query_params.get('id_cultivo') or self.request.query_params.get('cultivo')

        if tipo_sensor:
            queryset = queryset.filter(tipo_sensor=tipo_sensor)
        if estado:
            queryset = queryset.filter(estado=estado)
        if id_cultivo:
            queryset = queryset.filter(id_cultivo=id_cultivo)
        return queryset

    def create(self, request, *args, **kwargs):
        try:
            return super().create(request, *args, **kwargs)
        except Exception as e:
            import logging
            logging.getLogger(__name__).error('Error creando sensor. Payload: %s', request.data)
            logging.getLogger(__name__).error('Error creando sensor: %s', e, exc_info=True)
            raise

    def list(self, request, *args, **kwargs):
        try:
            return super().list(request, *args, **kwargs)
        except Exception as e:
            import logging
            logging.getLogger(__name__).error('Error listando sensores: %s', e, exc_info=True)
            raise

    @action(detail=True, methods=['post'])
    def toggle(self, request, pk=None):
        sensor = self.get_object()
        sensor.activo = not sensor.activo
        sensor.save()
        return Response({'success': True, 'activo': sensor.activo})

    @action(detail=True, methods=['patch'])
    def configurar(self, request, pk=None):
        sensor = self.get_object()
        sensor.frecuencia_minutos = request.data.get('frecuencia_minutos', sensor.frecuencia_minutos)
        sensor.rango_min = request.data.get('rango_min', sensor.rango_min)
        sensor.rango_max = request.data.get('rango_max', sensor.rango_max)
        sensor.save()
        return Response({'success': True, 'frecuencia_minutos': sensor.frecuencia_minutos, 'rango_min': sensor.rango_min, 'rango_max': sensor.rango_max})

    @action(detail=True, methods=['get'])
    def historial_mediciones(self, request, pk=None):
        sensor = self.get_object()
        mediciones = Medicion.objects.filter(id_sensor=sensor).order_by('-fecha_medicion')[:100]
        serializer = MedicionSerializer(mediciones, many=True)
        return Response(serializer.data)
