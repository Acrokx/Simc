from rest_framework import serializers
from .models import Alerta


class AlertaSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(source='id_alerta', read_only=True)
    sensor_codigo = serializers.CharField(source='id_sensor.codigo_sensor', read_only=True)
    sensor_tipo = serializers.CharField(source='id_sensor.tipo_sensor', read_only=True)

    class Meta:
        model = Alerta
        fields = ['id', 'id_alerta', 'tipo_alerta', 'descripcion', 'fecha_alerta', 'prioridad', 'leida', 'atendida', 'id_sensor', 'sensor_codigo', 'sensor_tipo', 'id_medicion', 'id_finca']
        read_only_fields = ['id', 'id_alerta', 'fecha_alerta']
