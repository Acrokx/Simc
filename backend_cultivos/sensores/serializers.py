from rest_framework import serializers
from .models import Sensor


class SensorSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(source='id_sensor', read_only=True)

    class Meta:
        model = Sensor
        read_only_fields = ['id_sensor', 'id']
        fields = ['id', 'id_sensor', 'codigo_sensor', 'tipo_sensor', 'ubicacion', 'estado', 'activo', 'frecuencia_minutos', 'rango_min', 'rango_max', 'id_cultivo']
