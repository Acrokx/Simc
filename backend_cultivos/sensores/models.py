from django.db import models
from cultivos.models import Cultivo


class Sensor(models.Model):
    """Modelo de Sensor instalado para monitorear el cultivo"""
    id_sensor = models.AutoField(primary_key=True, db_column='id_sensor')
    codigo_sensor = models.CharField(max_length=50, unique=True, blank=True, null=True)
    tipo_sensor = models.CharField(max_length=50)
    ubicacion = models.CharField(max_length=100)
    estado = models.CharField(max_length=50, default='Activo')
    activo = models.BooleanField(default=True)
    frecuencia_minutos = models.PositiveIntegerField(default=5, blank=True, null=True)
    rango_min = models.FloatField(blank=True, null=True)
    rango_max = models.FloatField(blank=True, null=True)
    id_cultivo = models.ForeignKey(Cultivo, on_delete=models.CASCADE, related_name='sensores', db_column='id_cultivo')

    class Meta:
        db_table = 'sensor'

    def __str__(self):
        referencia = self.codigo_sensor or self.tipo_sensor
        return f"{referencia} - {self.ubicacion} ({self.estado})"
