from rest_framework import serializers
from .models import Medicion


class MedicionSerializer(serializers.ModelSerializer):
    """Serializer para el modelo Medicion"""
    id = serializers.IntegerField(source='id_medicion', read_only=True)
    sensor_codigo = serializers.CharField(source='id_sensor.codigo_sensor', read_only=True)
    sensor_tipo = serializers.CharField(source='id_sensor.tipo_sensor', read_only=True)

    class Meta:
        model = Medicion
        fields = ['id', 'id_medicion', 'valor_humedad', 'fecha_medicion', 'id_sensor', 'sensor_codigo', 'sensor_tipo']
        read_only_fields = ['id', 'id_medicion', 'fecha_medicion']
